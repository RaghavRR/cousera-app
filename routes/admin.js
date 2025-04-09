const { Router } = require("express")
const adminRouter = Router();
const { adminModel, courseModel } = require("../db")
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { JWT_ADMIN_PASSWORD } = require("../config");
const course = require("./course");
const { adminMiddleware } = require("../middleware/admin");
const { Types } = require("mongoose");
const ObjectId = Types.ObjectId;



adminRouter.post("/signup", async function (req, res) {
    try {
        const { email, password, firstName, lastName } = req.body;

        // Hash the password before storing
        const hashedPassword = await bcrypt.hash(password, 10);

        await adminModel.create({
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


adminRouter.post("/signin", async function (req, res) {
    try {
        const { email, password } = req.body;

        const admin = await adminModel.findOne({ email });

        if (!admin) {
            return res.status(403).json({
                message: "Admin not found."
            });
        }

        const isPasswordCorrect = await bcrypt.compare(password, admin.password);

        if (!isPasswordCorrect) {
            return res.status(403).json({
                message: "Incorrect credentials."
            });
        }

        const token = jwt.sign(
            { id: admin._id },
            JWT_ADMIN_PASSWORD
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



adminRouter.post("/course", adminMiddleware , async function(req, res){
    const adminId = req.userId

    const { title, description, imageUrl, price } = req.body

    const course = await courseModel.create({
        title,
        description,
        price,
        imageUrl,
        creatorId : adminId
    })

    res.json({
        message : "Course created",
        courseId : course._id
    })
})

adminRouter.put("/course", adminMiddleware, async function(req, res) {
    const adminId = req.userId;
    const { title, description, imageUrl, price, courseId } = req.body;

    const course = await courseModel.findOne({
        _id: new ObjectId(courseId),
        creatorId: new ObjectId(adminId)
    });

    if (!course) {
        return res.status(404).json({
            message: "Course not found or unauthorized"
        });
    }

    await courseModel.updateOne(
        {
            _id: new ObjectId(courseId),
            creatorId: new ObjectId(adminId)
        },
        {
            title: title || course.title,
            description: description || course.description,
            imageUrl: imageUrl || course.imageUrl,
            price: price || course.price
        }
    );

    res.json({
        message: "Course Updated Successfully",
        course
    });
});


adminRouter.get("/course/bulk", adminMiddleware,  async function(req, res){
    const adminId = req.userId

    const courses = await courseModel.find({
        creatorId : adminId
    })

    res.json({
        message : "Course Update",
        courses
    })
})

module.exports = {
    adminRouter : adminRouter
}