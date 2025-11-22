/* CSCI 200: Assignment 2: A2 - PPM Image Editor
 *
 * Author: Daniel Langdon
 * 
 * Resources: Professor Scholten helped debug a certain parts in my for loop for inverting and grayscaling image as well as general code debugging
 * 
 * cplusplus.com/reference/string/string/substr/ to help get substring from lines of file
 * 
 * https://www.freecodecamp.org/news/string-to-int-in-c-how-to-convert-a-string-to-an-integer-example/#:~:text=One%20effective%20way%20to%20convert,the%20integer%20version%20of%20it.
 * This website helped me find the syntax to convert a string int to an in
 *
 * Starting template to read a PPM file and alter the image.
 * 
 * 
 */
#ifndef TEXT_H
#define TEXT_H
#include <iostream>
#include <fstream>
#include <string>

using namespace std;

/**
 * @brief Displays the options to the user for which file to load
 * 
 * @return int - the number of options available
 */
int print_file_options();

/**
 * @brief Displays the operations that the user can choose from
 * 
 * @return int - returns the number of operations available
 */
int print_operation_options();

/**
 * @brief Takes input for the file and operation to perform and ensures proper input type
 * 
 * @param max - max number of choices which is from other functions
 * @return int - returns the choice of the user
 */
int get_user_input(int max);

/**
 * @brief Opens input and output files based on choice and operation
 * 
 * @param ppmIn - file that the user chose for the program
 * @param ppmOut - output file based on operation user chose
 * @param choice - int for user file choice
 * @param operation - user operation choice
 * @return true - if files open successfully
 * @return false - if files fail to open
 */
bool open_files(ifstream &ppmIn, ofstream &ppmOut, int choice, int operation);

/**
 * @brief Ensures that the file is of the correct type (P3) and sets width, height and max based on the values in the file
 * 
 * @param ppmIn - file that was opened
 * @param width - int that will be modified based off of first number
 * @param height - int height will be modified based off of second number
 * @param max - int max that will be modified from third number in file
 * @return true - if file is correct type P3
 * @return false - if file is incorrect type
 */
bool read_header_information (ifstream &ppmIn, int& width, int& height, int& max); 

/**
 * @brief Writes the header block for the output file
 * 
 * @param ppmOut - output file to write to 
 * @param width - the width of the ppm image
 * @param height - the height of the ppm image
 * @param max - the max value for the ppm image
 */
void write_header_information (ofstream& ppmOut, int width, int height, int max);

/** @brief Reads each pixel value from input file and modifies and outputs to output file
 * 
 * @param ppmIn - input file
 * @param ppmOut - output file
 * @param operation - operation to change the input file
 * @param width - width of ppm image 
 * @param height - height of ppm image
 * @param max - max of ppm image
 */
void read_and_write_modified_pixels(ifstream& ppmIn, ofstream& ppmOut, int operation, int width, int height, int max);


#endif
