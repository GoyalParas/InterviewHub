import { Inngest } from "inngest";
import {connectDB} from './db.js';
import {User} from '../models/User.js';

import {upsertStreamUser, deleteStreamUser} from './stream.js';


export const inngest = new Inngest({ id: "InterviewHub" });

const syncUser = inngest.createFunction(
    {
        id: "sync-user",
        triggers: [
            { event: "user.created" },
            { event: "clerk/user.created" },
            { event: "clerk.user.created" },
        ],
    },
    async ({ event }) => {
        console.log('Inngest sync-user triggered:', event.name);
        await connectDB();

        const { id, email_addresses, first_name, last_name, image_url } = event.data;
        const email = email_addresses?.[0]?.email_address;

        if (!email) {
            throw new Error('Clerk user.created event payload missing email address');
        }

        const newUser = {
            clerkId: id,
            email,
            name: `${first_name || ""} ${last_name || ""}`.trim(),
            profileImage: image_url,
        };

        const created = await User.create(newUser);
        console.log('Created MongoDB user for Clerk ID:', created.clerkId);


        await upsertStreamUser({
            id: newUser.clerkId.toString(),
            name: newUser.name,
            image: newUser.profileImage,
        });
    }
);

const deleteUserFromDB = inngest.createFunction(
    {
        id: "delete-user-from-db",
        triggers: [
            { event: "user.deleted" },
            { event: "clerk/user.deleted" },
            { event: "clerk.user.deleted" },
        ],
    },
    async ({ event }) => {
        console.log('Inngest delete-user-from-db triggered:', event.name);
        await connectDB();

        const { id } = event.data;
        const result = await User.deleteOne({ clerkId: id });

        await deleteStreamUser(id.toString());
        console.log('Deleted MongoDB user count:', result.deletedCount);
    }
);


export const functions = [syncUser, deleteUserFromDB];
