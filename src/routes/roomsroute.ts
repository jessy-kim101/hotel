import { createRoomController, deleteRoomController, getAllRoomsController, getRoomByIdController, updateRoomsController } from '../controller/roomscontroller';
import { Express } from "express";

export const roomRoute = (app: Express) => {

    app.route("/rooms").get(
        async (req, res, next) => {
            try {
                
                await getAllRoomsController(req, res);
            } catch (error) {
                next(error);
            }
        }
    )
    app.route("/rooms/:id").get(
        async (req, res, next) => {
            try {
                await getRoomByIdController(req, res);
            } catch (error) {
                next(error);
            }
        }
    )
    app.route("/rooms").post(
        async (req, res, next) => {
            try {
                await createRoomController(req, res);
            } catch (error) {
                next(error);
            }
        }
    )
    app.route("/rooms/:id").put(
        async (req, res, next) => {
            try {
                await updateRoomsController(req, res);
            } catch (error) {
                next(error);
            }
        }
    )
    app.route("/rooms/:id").delete(
        async (req, res, next) => {
            try {
                await deleteRoomController(req, res);
            } catch (error) {
                next(error);
            }
        }
    )

}