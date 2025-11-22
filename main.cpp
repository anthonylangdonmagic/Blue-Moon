#include <iostream>
#include <fstream>

using namespace std;

int main() {
    ifstream garbage;
    garbage.open ("secretmessage.txt")
    
    if (garbage.fail ()) {
      return -1;
    }

    ofstream garbage_2 ("deciphered_message.txt");

    if (garbage_2.fail ()) {
      return -1;
    }

   char get = ' ';
    while (secretmessage.get (get)) {
      if get == '~' {
         garbage_2 << ' ';

      }

      else if get == '\n' {
         garbage_2 << '\n';
      }

      else {
         garbage_2 << char (get+1);
      }
   garbage.close ();
   garbage_2.close ();
   return 0;

    }



    }
