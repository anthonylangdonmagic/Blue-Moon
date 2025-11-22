#include <iostream>
#include <cstdlib>
#include <string>
#include <ctime>
using namespace std;

int main() {
    cout << "Do you want to play rock, paper, scissors? Type yes or no." << endl;
    string choice = " ";
    cin >> choice;

    while ( choice != "no"  &&  (choice != "No" && choice != "NO")){
       if ( choice == "yes" || choice == "Yes" || choice == "YES") 
        {cout << "Type either r, p, or s for your choice" << endl;
        cin >> choice;
         srand(time(0));
        rand();
        int botChoice = rand() % 2;
        if (choice == "r"){
            srand(time(0));
            rand();
            int botChoice = rand() % 2;
        if (botChoice == 0){
            cout << "computer chose r, so you tied." << endl;
        }
        if (botChoice == 1){
            cout << "computer chose p, so you lost. " << endl;
            }
        if (botChoice == 2){
            cout << "computer chose s, so you won!" << endl;
            } 
        }

        if (choice == "p"){
            srand(time(0));
            rand();
            int botChoice = rand() % 2;
        if (botChoice == 0){
            cout << "computer chose r, so you won!" << endl;
        }
        if (botChoice == 1){
            cout << "computer chose p, so you tied. " << endl;
            }
        if (botChoice == 2){
            cout << "computer chose s, so you lost." << endl;
            }
        }

        if (choice == "s"){
            srand(time(0));
            rand();
            int botChoice = rand() % 2;
        if (botChoice == 0){
            cout << "computer chose r, so you lost." << endl;
        }
        if (botChoice == 1){
            cout << "computer chose p, so you won! " << endl;
            }
        if (botChoice == 2){
            cout << "computer chose s, so you tied." << endl;
            }
        }
        cout << "Do you want to play again? Type yes or no." << endl;
        cin >> choice;
        }
          } 

}
