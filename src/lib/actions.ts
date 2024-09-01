"use server"

import { auth } from "@clerk/nextjs/server"
import prisma from "./client"
import { z } from "zod";

export const switchFollow = async (userId : string) =>{
    const {userId : currentUserId} = auth();

    if(!currentUserId){
        throw new Error("You must be logged in to follow a user")
    }

    try {
        const existingFollow = await prisma.follower.findFirst({
            where: {
                followerId: currentUserId,
                followingId: userId
            }
        })

        if(existingFollow){
            await prisma.follower.delete({
                where:{
                    id : existingFollow.id
                }
            })
        }else{
            const existingFollowRequest = await prisma.followRequest.findFirst({
                where: {
                    senderId: currentUserId,
                    receiverId: userId
                }
            });
            if(existingFollowRequest){
                await prisma.followRequest.delete({
                    where:{
                        id : existingFollowRequest.id
                    }
                })
            }else{
                await prisma.followRequest.create({
                    data: {
                        senderId: currentUserId,
                        receiverId: userId
                    }
                })
            }
        }
        
    } catch (err) {
        console.log(err)
        throw new Error("Something went wrong")
    }
}

export const switchBlock = async(userId:string) =>{
    const {userId:currentUserId} = auth();

    if(!currentUserId){
        throw new Error("User is not authenticated");
    }

    try {
        const existingBlock = await prisma.block.findFirst({
            where:{
                blockerId : currentUserId,
                blockedId : userId
            }
        })
        if(existingBlock){
            await prisma.block.delete({
                where:{
                    id : existingBlock.id,
                },
            })
        }else{
            await prisma.block.create({
                data:{
                    blockerId : currentUserId,
                    blockedId : userId 
                }
            })
        }
    } catch (err) {
        console.log(err)
        throw new Error("Something went wrong!");
    }
}

export const acceptFollowRequest = async(userId:string) =>{
    const {userId:currentUserId} = auth();
    if(!currentUserId){
        throw new Error("User is not authenticated");
    }

    try {
        const existingFollowRequest = await prisma.followRequest.findFirst({
            where:{
                senderId : userId,
                receiverId : currentUserId
            }
        })

        if(existingFollowRequest){
            await prisma.followRequest.delete({
                where:{
                    id : existingFollowRequest.id
                }
            });
            await prisma.follower.create({
                data:{
                    followerId : userId,
                    followingId : currentUserId 
                }
            });
        }
    } catch (error) {
        console.log(error)
        throw new Error("Something went wrong!");
    }
}

export const declineFollowRequest = async(userId:string) =>{
    const {userId:currentUserId} = auth();
    if(!currentUserId){
        throw new Error("User is not authenticated");
    }

    try {
        const existingFollowRequest = await prisma.followRequest.findFirst({
            where:{
                senderId : userId,
                receiverId : currentUserId
            }
        })

        if(existingFollowRequest){
            await prisma.followRequest.delete({
                where:{
                    id : existingFollowRequest.id
                }
            });
        }
    } catch (error) {
        console.log(error)
        throw new Error("Something went wrong!");
    }
}

export const updateProfile = async(
    prevState:{success:boolean, error:boolean},
    payload:{formData : FormData, cover:string})=>{

    const {formData, cover} = payload;    
    const fields = Object.fromEntries(formData);
    // so no null values are sent to the server. only the fields that are filled in.
    const filteredFields = Object.fromEntries(Object.entries(fields).filter(([_, value]) => value!== ''));

    const Profile = z.object({
        cover: z.string().optional(),
        name: z.string().max(60).optional(),
        surname: z.string().max(60).optional(),
        description: z.string().max(255).optional(),
        city: z.string().max(60).optional(),
        school: z.string().max(60).optional(),
        work: z.string().max(60).optional(),
        website: z.string().max(60).optional(),
    })

    const validatedProfile = Profile.safeParse({cover, ...filteredFields});
    if(!validatedProfile.success){
        console.log(validatedProfile.error.flatten().fieldErrors)
        return {success:false, error:true};
    }

    const {userId} = auth();
    if(!userId){
        throw new Error("User is not authenticated");
    }

    try {
        await prisma.user.update({
            where:{
                id : userId
            },
            data:validatedProfile.data
        })
        return {success:true, error:false};
    } catch (err) {
        console.log(err);
        return {success:false, error:true};
    }
}