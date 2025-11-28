import { google } from 'googleapis';
import { Readable } from 'stream';

const SCOPES = ['https://www.googleapis.com/auth/drive'];

export async function getDriveClient() {
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL?.trim();
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n').trim();

  if (!clientEmail || !privateKey) {
    throw new Error('Missing Google Service Account credentials');
  }

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: clientEmail,
      private_key: privateKey,
    },
    scopes: SCOPES,
  });

  return google.drive({ version: 'v3', auth });
}

export async function uploadFile(
  buffer: Buffer,
  name: string,
  mimeType: string,
  folderId?: string
) {
  const drive = await getDriveClient();
  const stream = Readable.from(buffer);

  const response = await drive.files.create({
    requestBody: {
      name,
      parents: folderId ? [folderId] : undefined,
    },
    media: {
      mimeType,
      body: stream,
    },
    fields: 'id, webViewLink, webContentLink',
  });

  // Make it public
  if (response.data.id) {
    await drive.permissions.create({
      fileId: response.data.id,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });
  }

  return response.data;
}

export async function getFileContent(fileId: string) {
  const drive = await getDriveClient();
  const response = await drive.files.get(
    { fileId, alt: 'media' },
    { responseType: 'stream' }
  );
  return response.data;
}

export async function findFile(name: string, folderId?: string) {
  const drive = await getDriveClient();
  const q = [
    `name = '${name}'`,
    'trashed = false',
    folderId ? `'${folderId}' in parents` : undefined,
  ]
    .filter(Boolean)
    .join(' and ');

  const response = await drive.files.list({
    q,
    fields: 'files(id, name, webViewLink)',
  });

  return response.data.files?.[0] || null;
}

export async function updateFile(fileId: string, buffer: Buffer, mimeType: string) {
  const drive = await getDriveClient();
  const stream = Readable.from(buffer);

  const response = await drive.files.update({
    fileId,
    media: {
      mimeType,
      body: stream,
    },
    fields: 'id, webViewLink',
  });

  return response.data;
}
