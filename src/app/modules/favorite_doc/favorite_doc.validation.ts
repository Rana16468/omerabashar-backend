import {z} from 'zod';

const favoriteValidationSchema=z.object({
    body: z.object({
        ocrtechsId:z.string({error:"ocrtechsId is required"})
    })
});


const favoriteValidation={
   favoriteValidationSchema
};
export default favoriteValidation;