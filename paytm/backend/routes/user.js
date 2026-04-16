const express = require('express');
const {z} = require('zod');
const bcrypt = require('bcrypt');
const { UserModal, AccountModal }  = require('../db');
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require('../confiq');
const { authMiddleware } = require('./middleware');

const router = express.Router();

const passwordSchema = z.string()
  .min(8, { message: "Password must be at least 8 characters long" })
  .max(100, { message: "Password must be less than 101" })
  .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
  .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
  .regex(/[0-9]/, { message: "Password must contain at least one number" })
  .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character" });

    const signupSchema = z.object({
    username: z.string().min(3).max(100),
    firstName: z.string().min(3).max(100),
    lastName: z.string().min(3).max(100),
    password: passwordSchema
    });

   router.post ("/signup", async function(req, res) {
       const body = req.body;
       const {success, error} = signupSchema.safeParse(req.body);
       if (!success){
           res.json({
               message: "Incorrect format",
               error: error
           });
           return;
       }

       const user = await UserModal.findOne({
        username: body.username
       })
       if (user) {
        return res.json({
            message: "Email already taken"
        })
       }
       const username = req.body.username;
       const password = req.body.password;
       const firstName = req.body.firstName;
       const lastName = req.body.lastName;
   
       const hashedPassword = await bcrypt.hash(password,10);
   
       const dbUser = await UserModal.create({
           firstName,
           username,
           lastName,
           password: hashedPassword                
       });
       await AccountModal.create({
        userId: dbUser._id,
        balance: "1000"
       })
       const token = jwt.sign({
        userId: dbUser._id
       }, JWT_SECRET, {
        expiresIn: "3d"
       });
   
       res.set('Authorization', 'Bearer ' + token);

       res.json({
           message: "User created successfully",
           token: token
   })
});


   router.post("/signin", async function (req, res) {
   
     const requiredbody = z.object({
       username:z.string().min(3),
       password: z.string().min(8)
     })
     const parsed = requiredbody.safeParse(req.body)
     if (!parsed.success){
           res.json({
               message: "Incorrect format",
               error: parsedData.error
           });
           return;
       }
   
     const username = req.body.username;
     const password = req.body.username;
   
     const user = await UserModal.findOne({
       username
     });
   
     const passwordMatch = bcrypt.compare(password, user.password);
     if (user && passwordMatch) {
       const token = jwt.sign({
           id: user._id.toString()
       },JWT_SECRET);
       res.json({
           token
       })
     } else {
       res.status(403).json({
           message: "Incorrect credential"
       })
     }
   });
   
   const updateBody = z.object({
    password: passwordSchema.optional(),
    firstName:z.string().min(3).max(100).optional(),
    lastName: z.string().min(3).max(100).optional()
   })
   router.put('/', authMiddleware, async (req, res) => {
        const {success} = updateBody.safeParse(req.body)
        if(!success){
            res.status(411).json({
                message: "Error while updating information"
            })
        }

        await UserModal.updateOne(
            {id: req.userId},
            req.body
        )

        res.json({
            message: "Update successfully"
        })
   })

   router.get("/bulk", authMiddleware, async (req, res) => {
    const filter = req.query.filter;
    const users =  await UserModal.find({
        $or: [{
            firstName: { $regex: filter, $options: "i"}
        },
        {
            lastName: { $regex: filter, $options: "i"}
        }]
    });
    res.json({
        users: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })
   })

module.exports = router;
