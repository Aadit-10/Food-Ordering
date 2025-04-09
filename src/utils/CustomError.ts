/**
 * Function to handle custom errors
 *
 * @param statusCode:number
 * @param message:string
 * @throws error
 */
export const customError = (statusCode: number, message: string): Promise<any> => {
    let error: any = new Error();
    error.message = message;
    error.statusCode = statusCode;
    throw error;
}