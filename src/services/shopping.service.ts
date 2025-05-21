import express, { Request, Router, Response, NextFunction } from "express";
import { FoodDoc, Offer, Vendor } from "../models";
import { customError } from "../utils";
import { StatusCodes } from "http-status-codes";
import { messages } from "../common/constants";

export const ShoppingService = {
    /**
    * Function to Find Food Available in a Region
    *
    * @param req
    * @returns availableFoods
    */
    getFoodAvailability: async (req: Request) => {

        const pincode = req.params.pincode;
        const availableFoods = await Vendor.find({ pincode, serviceAvailable: true })
            .sort([['rating', 'descending']])
            .populate('foods')

        if (!availableFoods) {
            customError(StatusCodes.BAD_REQUEST, messages.NO_FOOD_AVAILABLE)
        }

        return availableFoods
    },

    /**
    * Function to Find Top Restaurants
    *
    * @param req
    * @returns topRestaurants
    */
    getTopRestaurants: async (req: Request) => {

        const pincode = req.params.pincode;
        const limit = parseInt(req.query.limit as string) || 3;

        const topRestaurants = await Vendor.find({ pincode, serviceAvailable: true })
            .sort([['rating', 'descending']]).limit(limit);

        if (!topRestaurants) {
            customError(StatusCodes.BAD_REQUEST, messages.DATA_NOT_FOUND)
        }

        return topRestaurants
    },

    /**
    * Function to Find Food in 30 minutes
    *
    * @param req
    * @returns foodResults
    */
    getFoodIn30Min: async (req: Request) => {

        const pincode = req.params.pincode;
        const readyTime = parseInt(req.query.readyTime as string) || 15;

        const result = await Vendor.find({ pincode, serviceAvailable: true })
            .populate('foods');

        if (!result) {
            customError(StatusCodes.BAD_REQUEST, messages.DATA_NOT_FOUND)
        }

        let foodResults = []

        result.map(vendor => {
            const foods = vendor.foods as [FoodDoc];
            foodResults.push(...foods.filter(food => food.readyTime <= readyTime))
        })
        return foodResults;
    },

    /**
    * Function to Search Foods 
    *
    * @param req
    * @returns foodResult
    */
    searchFoods: async (req: Request) => {

        const pincode = req.params.pincode;

        const foods = await Vendor.find({ pincode, serviceAvailable: true })
            .populate('foods');

        if (!foods) {
            customError(StatusCodes.BAD_REQUEST, messages.DATA_NOT_FOUND)
        }

        let foodResult = []
        foods.map(item => foodResult.push(...item.foods))

        return foodResult
    },

    /**
    * Function to Search Offers 
    *
    * @param req
    * @returns foodResult
    */
    searchOffers: async (req: Request) => {
        const pincode = req.params.pincode;

        const offers = await Offer.find({ pincode, isActive: true })
        if (!offers) {
            customError(StatusCodes.BAD_REQUEST, messages.DATA_NOT_FOUND)
        }

        return offers
    },

    /**
    * Function to Find Restaurants by Id
    *
    * @param req
    * @returns 
    */
    RestaurantById: async (req: Request) => {

        const id = req.params.id;
        const restaurants = await Vendor.findById(id).populate('foods');

        if (!restaurants) {
            customError(StatusCodes.BAD_REQUEST, messages.DATA_NOT_FOUND)
        }
        return restaurants
    },
}