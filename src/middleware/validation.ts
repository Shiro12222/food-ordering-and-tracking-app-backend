import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

const handleValidationError = async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        res.sendStatus(400).json({ errors: errors.array() });
        return;
    }
    next();
}

export const validateMyUserRequest = [
    body("name").isString().notEmpty().withMessage("The name must be a string"),
    body("addressLine1").isString().notEmpty().withMessage("AddressLine1 must be a string"),
    body("city").isString().notEmpty().withMessage("City must be a string"),
    body("country").isString().notEmpty().withMessage("Country name must be a string"),
    handleValidationError,
];

export const validateMyRestaurantRequest = [
    body("restaurantName").isString().notEmpty().withMessage("Restaurant is required"),
    body("city").isString().notEmpty().withMessage("City is required"),
    body("country").isString().notEmpty().withMessage("Country is required"),
    body("deliveryPrice").isNumeric().withMessage("Delivery price must be a number").isFloat({ min: 0 }).withMessage("Delivery price must be greater than zero"),
    body("estimatedDeliveryTime").isNumeric().withMessage("Estimated delivery time must be a number").isInt({ gt: 0 }).withMessage("Estimated delivery time must be greater than zero"),
    body("cuisines").isArray().withMessage("Cuisines must be an array").notEmpty().withMessage("At least one cuisine is required")
        .custom(cuisines => {
            if (cuisines.length === 0) {
                throw new Error("At least one cuisine is required");
            }
            return true;
        }),     
    body("menuItems").isArray().withMessage("Menu items must be an array").optional()
        .custom(menuItems => {
            if (menuItems.length === 0) {
                throw new Error("Menu items cannot be empty if provided");
            }
            return true;
        }),
    body("menuItems.*.name").notEmpty().withMessage("MenuItem name is required"),
    body("menuItems.*.price").isFloat({min: 0}).withMessage("MenuItem price is required and must be positive"),
    handleValidationError,
];