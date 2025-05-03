import React, { useEffect, useState } from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

const StarRating = ({ rating }) => (
    <div className="flex text-yellow-500">
        {[...Array(5)].map((_, i) => (
            rating >= i + 1 ? <FaStar key={i} /> :
                rating >= i + 0.5 ? <FaStarHalfAlt key={i} /> :
                    <FaRegStar key={i} />
        ))}
    </div>
);


const UserReviews = ({ reviews }) => {

    console.log("Own rev ADmin pg ", reviews)
    const averageRating = reviews?.reviews?.length
    ? reviews.reviews.reduce((acc, cur) => acc + Number(cur?.rating || 0), 0) / reviews.reviews.length
    : 0;
  

    console.log("Average rating", averageRating)



    return (
        <div className="bg-white p-6 rounded-lg shadow-xl border-2 border-orange-400 space-y-4">
            <h3 className="text-xl font-semibold">⭐ User Reviews</h3>

            {/* Average Rating */}
            <div className="flex items-center gap-2">
                <span className="font-medium">Average Rating:</span>
                <StarRating rating={averageRating} />
            </div>
            {/* Total Review */}
            <div className="flex items-center gap-2">
                <span className="font-medium">Total Reviews : {reviews?.totalReview}</span>
                {/* <StarRating rating={reviews?.totalReview} /> */}
            </div>

            {/* Scrollable Reviews Section */}
            <div className="max-h-64 overflow-y-auto space-y-4">
                {reviews?.reviews?.map((rev, i) => (
                    <div key={i} className="p-4 bg-orange-100 rounded-lg shadow space-y-2">
                        {/* Product Details */}
                        <div className="text-sm text-gray-700 bg-white p-3 rounded-md border border-gray-200">
                            <h4 className="font-semibold text-gray-800 mb-2">🛍️ Products Reviewed:</h4>
                            <div className="space-y-1">
                                {rev?.productId?.map((product, idx) => (
                                    <div
                                        key={idx}
                                        className="p-2 bg-orange-50 rounded-md border border-orange-200 shadow-sm"
                                    >
                                        <p><span className="font-medium text-gray-800">Name:</span> {product?.productName}</p>
                                        <p><span className="font-medium text-gray-800">ID:</span> {product?._id}</p>
                                    </div>
                                ))}
                            </div>
                        </div>


                        <p>{rev?.createdAt}</p>

                        {/* Reviewer Info */}
                        <div className="flex items-center justify-between">
                            <strong className="text-lg">User : {rev?.userId?.name}</strong>
                            <StarRating rating={rev?.rating} />
                        </div>

                        {/* Review Comment */}
                        <p className="text-gray-700 mt-1 italic">"{rev?.comment}"</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserReviews;
