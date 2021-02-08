const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const User = require('../models/userModel');
const Booking = require('../models/bookingModel');

exports.getOverview = catchAsync(async (req, res, next) => {
  // 1) Get tour data from collection
  const tours = await Tour.find();

  // 2) Build template
  // 3) Render that template using the tour data from step 1
  res
    .status(200)
    .set(
      'Content-Security-Policy',
      ";default-src 'self' https://*.mapbox.com https://js.stripe.com/ ;connect-src http: ws: wss: 'unsafe-inline' 'unsafe-eval' data: blob: ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src 'self' https://cdnjs.cloudflare.com https://*.mapbox.com https://js.stripe.com/v3/ blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;"
    )
    .render('overview', {
      title: 'All Tours',
      tours,
    });
});

exports.getTours = catchAsync(async (req, res, next) => {
  // 1) get the data for the requested tour (includes reviews and tour guides)
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });

  if (!tour) {
    return next(new AppError('There is no tour with that url.', 404));
  }
  // 2) Build template

  // 3) Render template using the data from step 1
  res
    .status(200)
    .set(
      'Content-Security-Policy',
      ";default-src 'self' https://*.mapbox.com https://js.stripe.com/ ;connect-src http: ws: wss: 'unsafe-inline' 'unsafe-eval' data: blob: ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src 'self' https://cdnjs.cloudflare.com https://*.mapbox.com https://js.stripe.com/v3/ blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;"
    )
    .render('tour', {
      title: tour.name,
      tour,
    });
});

exports.getLoginForm = (req, res) => {
  res
    .status(200)
    .set(
      'Content-Security-Policy',
      ";default-src 'self' https://*.mapbox.com https://js.stripe.com/ ;connect-src http: ws: wss: 'unsafe-inline' 'unsafe-eval' data: blob: ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src 'self' https://cdnjs.cloudflare.com https://*.mapbox.com https://js.stripe.com/v3/ blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;"
    )
    .render('login', {
      title: 'Login to your account',
    });
};

exports.getAccount = (req, res) => {
  res
    .status(200)
    .set(
      'Content-Security-Policy',
      ";default-src 'self' https://*.mapbox.com ;connect-src http: ws: wss: 'unsafe-inline' 'unsafe-eval' data: blob: ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src 'self' https://cdnjs.cloudflare.com https://*.mapbox.com blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;"
    )
    .render('account', {
      title: 'Your account',
    });
};

exports.getMyTours = catchAsync(async (req, res, next) => {
  // Find all bookings
  const bookings = await Booking.find({ user: req.user.id });
  // Find tours with the return IDs
  const tourIds = bookings.map((el) => el.tour);
  const tours = await Tour.find({ _id: { $in: tourIds } });

  res
    .status(200)
    .set(
      'Content-Security-Policy',
      ";default-src 'self' https://*.mapbox.com https://js.stripe.com/ ;connect-src http: ws: wss: 'unsafe-inline' 'unsafe-eval' data: blob: ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src 'self' https://cdnjs.cloudflare.com https://*.mapbox.com https://js.stripe.com/v3/ blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;"
    )
    .render('overview', {
      title: 'My Tours',
      tours,
    });
});

exports.updateUserData = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res
    .status(200)
    .set(
      'Content-Security-Policy',
      ";default-src 'self' https://*.mapbox.com ;connect-src http: ws: wss: 'unsafe-inline' 'unsafe-eval' data: blob: ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src 'self' https://cdnjs.cloudflare.com https://*.mapbox.com blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;"
    )
    .render('account', {
      title: 'Your account',
      user: updatedUser,
    });
});
