import {z} from "zod";


const currentSubscriptionSchema=z.object({

    body: z.object({
        subscriptionId: z.string({error:"subscriptionId is required"})
    })
});

const currentSubscriptionValidation={
    currentSubscriptionSchema
};

export default currentSubscriptionValidation;

