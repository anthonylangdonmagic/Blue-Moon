#include "text.h"

using namespace std;

int print_file_options () {
    cout << "which image do you want to load?" << endl;
    cout << "1 Brick" << endl;
    cout << "2 Wallpaper" << endl;
    cout << "3 Private" << endl;
    int options = 3;
    return options;
}

int print_operation_options () {
    cout << "Which process do you want to apply?" << endl;
    cout << "1 Greyscale" << endl;
    cout << "2 Inversion" << endl;
    int options = 2;
    return options;
}

int get_user_input (int max) {
    if (max == 3)
}
