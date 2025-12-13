import * as bcrypt from 'bcryptjs';


class HelperUtil {
    constructor() {

    }

    /**
     * @method HelperUtil:hashData
     * @description Utility method to hash data using bcrypt.
     * @param data 
     * @returns 
    **/
    async hashData(data: string): Promise<string> {
        const salt = await bcrypt.genSalt(10);
        const hashedData = await bcrypt.hash(data, salt);
        return hashedData;
    }    


    /**
     * @method HelperUtil:compareData
     * @description Utility method to compare raw data with hashed data.
     * @param data 
     * @param hashedData 
     * @returns 
    **/
    async compareData(data: string, hashedData: string): Promise<boolean> {
        return await bcrypt.compare(data, hashedData);
    }   
    


}

export const helperUtil = new HelperUtil();