const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const bcrypt = require("bcrypt");

function initialize(passport, getUserByEmail, getUserById) {
    const authenticateUser = async (email, password, done) => {
        const user = getUserByEmail(email)
        if (user == null) {
            return done(null, false, { message: "That email address is not registered." })
        }

        try {
            if (await bcrypt.compare(password, user.password)) {
                return done(null, user)
            } else {
                return done(null, false, { message: "Password is incorrect." })
            }
        } catch (e) {
            return done(e);
        }
    }
    passport.use(new LocalStrategy({ usernameField: "email" },
        authenticateUser))
        
    passport.serializeUser((user, done) => done(null, user.id))
    passport.deserializeUser((id, done) => {
        return done(null, getUserById(id))
    })

    passport.use(new GoogleStrategy({
        callbackURL: "/auth/google/cb",
        clientID: process.env.clientID,
        clientSecret: process.env.clientSecret,
        // passReqToCallback: true
    }, (accessToken, refreshToken, profile, done) => {
        // passport callback function
        console.log('passport callback function fired:');
        // return console.log(profile);
        return (console.log(profile));

    })
    );


    // passport.use(new GoogleStrategy({
    //     clientID:     process.env.clientID,
    //     clientSecret: process.env.clientSecret,
    //     callbackURL: "http://localhost:8080/auth/google/cb",
    //     passReqToCallback   : true
    //   },
    //   function(request, accessToken, refreshToken, profile, done) {
    //     User.findOrCreate({ googleId: profile.id }, function (err, user) {
    //       return done(err, user);
    //     });
    //   }
    // ));



};

module.exports = initialize