const router = require('express').Router();
const User = require('./userSchema');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.get('/register', async (req, res) => {
    // http://localhost:5000/api/register
    //      INPUT: {
    //     "name":"name",
    //     "email":"email",
    //     "password":"password"
    // }
    //res.send("Hii i am from register");
    try {
        var emailExist = await User.findOne({ email: req.body.email });
        if (emailExist) {
            return res.status(400).json("Email already exist");
        }

        //Password hash
        var hash = await bcrypt.hash(req.body.password, 10);

        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: hash //req.body.password
        });

        var data = await user.save();

        // res.json(req.body);
        res.json(data);
    } catch (error) {
        res.status(400).json(err);
    }
    // res.json(user);
});


router.post('/login', async (req, res) => {
    // http://localhost:5000/api/login
    //      INPUT: {
    //     "email":"email",
    //     "password":"password"
    // }

    try {
        var userData = await User.findOne({ email: req.body.email });
        if (!userData) {
            return res.status(400).json("Email not exist");
        }
        var validPsw = await bcrypt.compare(req.body.password, userData.password);
        if (!validPsw) {
            return res.status(400).json("Password not valid");
        }

        var userToken = await jwt.sign({ email: userData.email }, 'Deepa');
        res.headers('auth', userToken).send(userToken);

    } catch (error) {
        res.status(400).json(err);
    }
});

const validUser = (req, res, next) => {
    var token = req.header('auth');
    req.token = token;

    next();
}
router.get('/getAll', validUser, async (req, res) => {
    // http://localhost:5000/api/getAll
    //     "auth":"token",
    jwt.verify(res.token, 'Deepa', (err, data) => {
        if (err) {
            res.sendStatus(403);
        } else {
            const data = await User.find();
            res.json(data);
        }
    })
    // const data = await User.find();
    // res.json(data);
})

module.exports = router;
