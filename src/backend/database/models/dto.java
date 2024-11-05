// A DTO is an object that carries data between two processes. 
// We need DTO objects for each entity
// This file checks to ensure they're working properly.

package models;
public class dto {
    // Testing accessory DTO
    public static void main(String[] args) {
        Accessory accessory = new Accessory(1, "baseball cap", "hat", 4, 2, 30, "baseballcap");
        System.out.println(accessory);
    }
}