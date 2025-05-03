import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { createServiceCategory, dltSubCategory, getServiceByCategory } from '../../features/serviceSlice';
import { toast } from 'react-toastify';

const CategorySubcategoryManager = () => {
  const initialCategories = {
    PC: ["Repair", "Upgrade", "Cleaning"],
    Laptop: ["Screen Repair", "Battery Replacement", "General Service"],
    Other: ["Custom Service 1", "Custom Service 2", "Consultation"],
  };

  const dispatch = useDispatch()
  const [categories, setCategories] = useState(initialCategories);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [subcategoryInput, setSubcategoryInput] = useState('');

  //all subcategories 
  const [allSub,setAllSub]= useState([])

  
  const showServiceByCategory = async(categoryName)=>{
    try{
      console.log("MY Category name ",categoryName);
      const rs = await dispatch(getServiceByCategory({name:categoryName})).unwrap();
      console.log(rs?.data);
      setAllSub(rs?.data);
      toast.success(rs?.message)
    }
    catch(er){
      console.log(er);
      toast.error(er)
    }
  }



  // Handle category selection
  const handleCategorySelect = (e) => {
    let selected =e.target.value
    setSelectedCategory(e.target.value);
    setSubcategoryInput('');
    if(selected){
      showServiceByCategory(selected)
    }
  };

  // Handle subcategory input changes
  const handleInputChange = (e) => {
    setSubcategoryInput(e.target.value);
  };

  // Add subcategory to selected category
  const handleAddSubcategory =async () => {
    // if (subcategoryInput.trim() && selectedCategory) {
    //   setCategories((prevCategories) => {
    //     const updatedCategory = [...prevCategories[selectedCategory], subcategoryInput];
    //     return {
    //       ...prevCategories,
    //       [selectedCategory]: updatedCategory,
    //     };
    //   });
      try{
        console.log("Created Service ", selectedCategory,subcategoryInput)
        const response= await dispatch(createServiceCategory({
          name:selectedCategory,
          subCategories:subcategoryInput
        })).unwrap();
        console.log(response)
        toast.success(response?.message)
      }
      catch(er){
        console.log(er)
        toast.error(er)
      }
      setSubcategoryInput('');
      showServiceByCategory(selectedCategory)
    
  };

  // Remove subcategory from selected category
  const handleRemoveSubcategory = async(name,subCategories) => {
    // setCategories((prevCategories) => {
    //   const updatedCategory = prevCategories[selectedCategory].filter(
    //     (sub) => sub !== subcategory
    //   );
    //   return {
    //     ...prevCategories,
    //     [selectedCategory]: updatedCategory,
    //   };
    // });

    try{
      const rs= await dispatch(dltSubCategory({name:name,subCategories:subCategories})).unwrap()
      console.log(rs)
      toast.success(rs?.message)
      showServiceByCategory(selectedCategory)
    }catch(er){
      toast.error(er)
      console.log(er)
    }

  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg max-w-3xl mx-auto">
      <h2 className="text-4xl font-semibold text-center text-gray-900 mb-8">
        Manage Categories & Subcategories
      </h2>

      {/* Category Selection */}
      <div className="mb-6">
        <label className="block text-lg text-gray-700 mb-2">Select Category</label>
        <select
          value={selectedCategory}
          onChange={handleCategorySelect}
          className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
        >
          <option value="">Select Category</option>
          {Object.keys(categories).map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Subcategory Input */}
      {selectedCategory && (
        <div className="mb-6">
          <label className="block text-lg text-gray-700 mb-2">Add Subcategory</label>
          <div className="flex space-x-4">
            <input
              type="text"
              value={subcategoryInput}
              onChange={handleInputChange}
              placeholder="Enter Subcategory Name"
              className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
            />
            <button
              onClick={handleAddSubcategory}
              className="bg-blue-600 text-white px-6 py-4 rounded-lg shadow-lg hover:bg-blue-700 transition duration-300"
            >
              Add
            </button>
          </div>
        </div>
      )}

      {/* Display Subcategories */}
      {selectedCategory && (
  <div className="mt-6">
    <h3 className="text-2xl font-semibold text-gray-800 mb-4">
      Subcategories for {selectedCategory}
    </h3>
    <ul className="space-y-4">
      {allSub?.map((data, index) =>
        Array.isArray(data?.subCategories) ? (
          data.subCategories.map((sub, i) => (
            <li
              key={`${index}-${i}`}
              className="flex justify-between items-center p-4 bg-gray-50 rounded-lg shadow-sm hover:bg-gray-100 transition duration-300"
            >
              <span className="text-lg text-gray-800">{sub}</span>
              <button
                onClick={() => handleRemoveSubcategory(data.name, sub)}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-300"
              >
                Remove
              </button>
            </li>
          ))
        ) : (
          <p className="text-gray-500">No subcategories found</p>
        )
      )}
    </ul>
  </div>
)}

    </div>
  );
};
export default CategorySubcategoryManager;
