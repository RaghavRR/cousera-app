const { Router } = require("express");
const { userModel, purchaseModel, courseModel } = require("../db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const { JWT_USER_PASSWORD } = require("../config.js");
const { userMiddleware } = require("../middleware/user.js");
const userRouter = Router();

// Signup route
userRouter.post("/signup", async function (req, res) {
    try {
        const { email, password, firstName, lastName } = req.body;

        // Hash the password before storing
        const hashedPassword = await bcrypt.hash(password, 10);

        await userModel.create({
            email,
            password: hashedPassword,
            firstName,
            lastName
        });

        res.json({
            message: "SignUp Successfully.."
        });

    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).json({
            error: "Something went wrong during signup."
        });
    }
});

// Signin route
userRouter.post("/signin", async function (req, res) {
    try {
        const { email, password } = req.body;

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(403).json({
                message: "User not found."
            });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return res.status(403).json({
                message: "Incorrect credentials."
            });
        }

        const token = jwt.sign(
            { id: user._id },
            JWT_USER_PASSWORD
        );

        res.json({
            token: token
        });

    } catch (error) {
        console.error("Error during signin:", error);
        res.status(500).json({
            error: "Something went wrong during signin."
        });
    }
});

userRouter.post("/purchases",userMiddleware, async function (req, res){
    const userId = req.userId

    const purchases = await purchaseModel.find({
        userId
    })

    const courseData = await courseModel.find({
        _id :{ $in :purchases.map(x => x.courseId)}
    })

    res.json({
        purchases,
        courseData
    })
})


module.exports = { userRouter };
