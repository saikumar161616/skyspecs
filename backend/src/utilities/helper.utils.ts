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


    async crackRule(data: any): Promise<boolean> {
        if ( data.category === 'BLADE_DAMAGE' && data.notes && data.notes.toLowerCase().includes('crack')) return true;
        return false;
    }



}

export const helperUtil = new HelperUtil();