import React, { useEffect, useState } from 'react';
import AppointmentTable from '../../Components/ServiceComponents/AppointmentTable';
import RescheduleModal from '../../Components/ServiceComponents/RescheduleModal';
import LocalAppointmentTable from '../../Components/ServiceComponents/LocalAppointmentTable';
import CategorySubcategoryManager from '../../Components/ServiceComponents/CategorySubcategoryManager';
import { useDispatch } from 'react-redux';
import { cancelService, completeServiceUser, getAllUserService, reScheduleUserService } from '../../features/serviceSlice';
import { toast } from 'react-toastify';


const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('appointments'); // Default to appointments view
  const [appointments, setAppointments] = useState([]);

  
  const dispatch = useDispatch()

  const getUserAppoinment = async()=>{
    try{
      const rs= await dispatch(getAllUserService()).unwrap();
      console.log(rs?.data)
      setAppointments(rs?.data);
      toast.success(rs?.message)
    }
    catch(er){
      console.log(er)
      toast.error(er)
    }
  }

  useEffect(()=>{
    getUserAppoinment();
  },[dispatch])


  const [localAppointments, setLocalAppointments] = useState([
    {
      id: 3,
      customerName: 'Alice Johnson',
      email: 'alice@example.com',
      date: '2025-02-22',
      time: '11:00 AM',
      serviceType: 'Phone Repair',
      status: 'Scheduled',
      customerDetails: 'Alice is a first-time customer.',
      serviceRequested: 'Screen replacement for phone',
      notes: 'No special requests.'
    }
  ]);

  const [showRescheduleForm, setShowRescheduleForm] = useState(false);
  const [rescheduleData, setRescheduleData] = useState({ id: '', date: '', time: '' });

  // Handle Rescheduling
  const handleRescheduleClick = (appointment, isLocal = false) => {
    // setRescheduleData(appointment);
    console.log("Clicked appointment:", appointment); // Debug
    setRescheduleData({
      id: appointment?._id, // appointment id (optional if needed)

    });
    setShowRescheduleForm(true);
  };
  

  const handleRescheduleSubmit =async () => {
    // const updatedAppointments = appointments.map((appointment) =>
    //   appointment.id === rescheduleData.id
    //     ? { ...appointment, date: rescheduleData.date, time: rescheduleData.time, status: 'Scheduled' }
    //     : appointment
    // );
    // setAppointments(updatedAppointments);

    // const updatedLocalAppointments = localAppointments.map((appointment) =>
    //   appointment.id === rescheduleData.id
    //     ? { ...appointment, date: rescheduleData.date, time: rescheduleData.time, status: 'Scheduled' }
    //     : appointment
    // );
    // setLocalAppointments(updatedLocalAppointments);

    try{
      console.log(rescheduleData)
      const res= await dispatch(reScheduleUserService({time:rescheduleData.time ,date: rescheduleData.date, apppoinmentId : rescheduleData.id})).unwrap();
      console.log(res?.data?.updateUserService);

      const updatedService = res?.data?.updatedUserService;

      setAppointments((prev) =>
        prev.map((appointment) =>
          appointment._id === updatedService._id ? updatedService : appointment
        )
      );

      toast.success(res?.message);
    }catch(er){
      toast.error(er);
    }

    setShowRescheduleForm(false);
  };

  const handleCancel = async(id) => {
    // const updatedAppointments = appointments.map((appointment) =>
    //   appointment.id === id
    //     ? { ...appointment, status: 'Canceled' }
    //     : appointment
    // );
    // setAppointments(updatedAppointments);

    // const updatedLocalAppointments = localAppointments.map((appointment) =>
    //   appointment.id === id
    //     ? { ...appointment, status: 'Canceled' }
    //     : appointment
    // );
    // setLocalAppointments(updatedLocalAppointments);

    try{
      const rs =await dispatch(cancelService({userId:id})).unwrap();
      console.log(rs?.data)
      toast.success(rs?.message)

      let updatedService= rs?.data?.user;
      
      setAppointments((prev) =>
        prev.map((appointment) =>
          appointment._id === updatedService._id ? updatedService : appointment
        )
      );

    }
    catch(er){
      toast.error(er)
    }

  };

  const handleComplete = async(id) => {
    // const updatedAppointments = appointments.map((appointment) =>
    //   appointment.id === id
    //     ? { ...appointment, status: 'Completed' }
    //     : appointment
    // );
    // setAppointments(updatedAppointments);

    // const updatedLocalAppointments = localAppointments.map((appointment) =>
    //   appointment.id === id
    //     ? { ...appointment, status: 'Completed' }
    //     : appointment
    // );
    // setLocalAppointments(updatedLocalAppointments);

    try{
      const rs =await dispatch(completeServiceUser({userId:id})).unwrap();
      console.log(rs?.data)
      toast.success(rs?.message)

      let updatedService= rs?.data?.user;
      
      setAppointments((prev) =>
        prev.map((appointment) =>
          appointment._id === updatedService._id ? updatedService : appointment
        )
      );

    }
    catch(er){
      toast.error(er)
    }

  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="container mx-auto">
        {/* Navigation Section */}
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setActiveTab('appointments')}
            className={`px-4 py-2 rounded-md ${activeTab === 'appointments' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Appointments
          </button>
          {/* <button
            onClick={() => setActiveTab('localAppointments')}
            className={`px-4 py-2 rounded-md ${activeTab === 'localAppointments' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Local Appointments
          </button> */}
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-4 py-2 rounded-md ${activeTab === 'categories' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Categories & Subcategories
          </button>
        </div>

        {/* Title Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-gray-800">Admin Dashboard</h1>
          <p className="text-lg text-gray-600">Manage appointments and schedule services.</p>
        </div>

        {/* Conditionally Render Content Based on Active Tab */}
        {activeTab === 'appointments' && (
          <div className="overflow-x-auto bg-white shadow-md rounded-lg p-6">
            <AppointmentTable
              appointments={appointments}
              handleRescheduleClick={handleRescheduleClick}
              handleCancel={handleCancel}
              handleComplete={handleComplete} // Passing handleComplete here
            />
          </div>
        )}

        {/* {activeTab === 'localAppointments' && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Local Appointments</h2>
            <LocalAppointmentTable
              localAppointments={localAppointments}
              handleRescheduleClick={handleRescheduleClick}
              handleCancel={handleCancel}
              handleComplete={handleComplete} // Pass the same handlers to local appointments
            />
          </div>
        )} */}

        {activeTab === 'categories' && (
          <div className="bg-white shadow-md rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Manage Categories & Subcategories</h2>
            <CategorySubcategoryManager />
          </div>
        )}

        {/* Reschedule Modal */}
        <RescheduleModal
          showRescheduleForm={showRescheduleForm}
          rescheduleData={rescheduleData}
          setRescheduleData={setRescheduleData}
          handleRescheduleSubmit={handleRescheduleSubmit}
          setShowRescheduleForm={setShowRescheduleForm}
        />
      </div>
    </div>
  );
};

export default AdminPage;
