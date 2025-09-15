// middlewares/passport.ts
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '@/model/User';
// import { generateToken } from '@/utils/generateToken';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: process.env.GOOGLE_CALLBACK_URL as string,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // check if user exists
        let user = await User.findOne({ email: profile.emails?.[0].value });
        if (!user) {
          user = new User({
            name: profile.displayName,
            email: profile.emails?.[0].value,
            role: 'user',
            googleId: profile.id,
          });
          await user.save();
        }

        // generate JWT
        // const token = generateToken({ _id: user._id.toString(), role: user.role });

        // pass user + token to callback
        done(null, user);
      } catch (err) {
        done(err, undefined);
      }
    }
  )
);

// serialize/deserialize (required by passport)
passport.serializeUser((data, done) => {
  done(null, data);
});

passport.deserializeUser((data, done) => {
  done(null, data as undefined);
});

export default passport;
