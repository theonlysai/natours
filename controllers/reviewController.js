const Review = require('../models/reviewModel');
//const authController = require('./authController');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
const AppError = require('../utils/appError');
// const APIFeatures = require('../utils/apiFeatures');
// const catchAsync = require('../utils/catchAsync');

exports.setToursUserIds = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getAllReviews = factory.getAll(Review);
exports.getReview = factory.getOne(Review);
exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);

exports.deleteMyReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.reviewId);
  const currentUser = await User.findById(req.user.id);

  if (!review) {
    return next(new AppError('No document found with that ID', 404));
  }

  if (!(currentUser.id === review.user.id)) {
    return next(new AppError('You cannot delete other peoples review', 401));
  }

  await Review.findByIdAndDelete(req.params.reviewId);

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.updateMyReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.reviewId);
  const currentUser = await User.findById(req.user.id);

  if (!review) {
    return next(new AppError('No document found with that ID', 404));
  }

  if (!(currentUser.id === review.user.id)) {
    return next(new AppError('You cannot update other peoples review', 401));
  }

  const doc = await Review.findByIdAndUpdate(req.params.reviewId, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      data: doc,
    },
  });
});
