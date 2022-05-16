const localStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

function initialize(passport, getUserByEmail, getUserByid){

    const authenticateUser = async (email, password, done) => {
        const user = getUserByEmail(email)
        
        if (user == null) {
            return done(null, false, {message: 'No user found with that email'})
        }

        try{
            if  (await bcrypt.compare(password, user.password)) {
                return done(null, user)
            } else{
                return done(null, false, {message: 'Password incorrect <a href="/forgot-password">Forgot Password?</a>'})
            }
        } catch (e){
            return done(e)
        }
    }

    passport.use(new localStrategy({usernameField: "email"}, authenticateUser))

    passport.serializeUser((user, done) => {
        return done(null, user._id)
    })

    passport.deserializeUser((_id, done) => {
        return done(null, getUserByid(_id))
    })
}

module.exports = initialize