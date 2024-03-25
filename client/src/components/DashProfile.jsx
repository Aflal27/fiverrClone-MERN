import { Alert, Button, Modal, TextInput, Textarea } from "flowbite-react";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { IoClose } from "react-icons/io5";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import axios from "axios";
import {
  deleteSuccess,
  updateSuccess,
  deleteStart,
} from "../redux/slices/userSlice";
import { Link } from "react-router-dom";

export default function DashProfile() {
  const { toggle } = useSelector((state) => state.toggleState);
  const { currentUser } = useSelector((state) => state.userState);
  const filePicker = useRef();
  const [showModal, setshowModal] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [formData, setFormData] = useState({});
  const [userSkill, setUserSkill] = useState("");
  const [userSkills, setUserSkills] = useState([]);
  const [skillError, setSkillError] = useState("");
  const [imageUploadError, setImageUploadError] = useState("");
  const [uploadImageProgress, setUploadImageProgress] = useState(0);
  const [userUpdateError, setUserUpdateError] = useState("");
  const [updateSuccessMsg, setUpdateSuccessMsg] = useState("");
  const [signOutError, setSignOutError] = useState(null);
  const [DeleteError, setDeleteError] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  const uploadImage = () => {
    /* rules_version = '2';
2
​
3
// Craft rules based on data in your Firestore database
4
// allow write: if firestore.get(
5
//    /databases/(default)/documents/users/$(request.auth.uid)).data.isAdmin;
6
service firebase.storage {
7
  match /b/{bucket}/o {
8
    match /{allPaths=**} {
9
      allow read;
10
      allow write; if
11
      request.resource.size < 2 * 1024 *1024 &&
12
      requset.resource.contentType.matches('image/.*')
13
    }
14
  }
15
}
^
*/

    setImageUploadError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile?.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadImageProgress(progress.toFixed(0));
      },
      (error) => {
        // reject(error);
        setImageUploadError(
          "Could not upload image (file must be less then 2mb)"
        );
        setImageFile(null);
        setImageFileUrl(null);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
          setImageFileUrl(downloadUrl);
          setFormData({ ...formData, image: downloadUrl });
        });
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  const handleSkill = (e) => {
    setUserSkill(e.target.value);
  };

  useEffect(() => {
    handleFormSkill();
  }, [userSkills]);

  const handleFormSkill = () => {
    if (userSkills.length > 0) {
      setFormData({ ...formData, skills: userSkills });
    }
  };

  const handleSkillBtn = (skills) => {
    if (userSkill.length === 0) {
      setSkillError("please fill");
      return;
    }
    if (userSkill.length > 25) {
      setSkillError("max 25 letters in allowed");
    } else {
      setUserSkills([...userSkills, userSkill]);
      setUserSkill("");
    }
  };
  const handleSkillDlt = (skill) => {
    setUserSkills(userSkills.filter((s) => s !== skill));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUserUpdateError("");
    if (Object.keys(formData).length === 0) {
      setUserUpdateError("No change made");
      return;
    }
    try {
      const { data } = await axios.put(
        `/api/user/updateuser/${currentUser._id}`,
        formData
      );

      dispatch(updateSuccess(data));
      setUpdateSuccessMsg("Update Success!");
    } catch (error) {
      console.log("user update error", error);
      setUserUpdateError(error.response.data);
    }
  };

  const handleSignout = async () => {
    try {
      await axios.post("/api/user/signout");
      dispatch(deleteSuccess());
    } catch (error) {
      console.log("signout", error);
      setSignOutError(error);
    }
  };

  const handleDelete = async () => {
    setshowModal(!showModal);
    try {
      dispatch(deleteStart());
      await axios.delete(`/api/user/deleteuser/${currentUser._id}`);
      dispatch(deleteSuccess());
    } catch (error) {
      setDeleteError(error);
    }
  };

  return (
    <div className=" mx-auto max-w-lg p-3 w-full ">
      <h1 className=" text-xl text-center my-5">Profile</h1>

      <form onSubmit={handleSubmit} className=" flex flex-col gap-4">
        <input
          hidden
          type="file"
          accept="image/*"
          ref={filePicker}
          onChange={handleImage}
        />
        <img
          onClick={() => filePicker.current.click()}
          src={imageFileUrl ? imageFileUrl : currentUser?.image}
          alt="user image"
          className=" w-[155px] rounded-full mx-auto object-cover mt-4"
        />
        {uploadImageProgress > 0 && (
          <span className=" text-center">{uploadImageProgress}%</span>
        )}
        {imageUploadError && (
          <Alert color="failure" className=" text-center">
            {imageUploadError}
          </Alert>
        )}

        <TextInput
          defaultValue={currentUser?.username}
          type="text"
          placeholder="username"
          id="userName"
          onChange={handleChange}
        />
        <TextInput
          defaultValue={currentUser?.email}
          type="email"
          placeholder="email"
          id="email"
          onChange={handleChange}
        />
        <TextInput
          type="password"
          placeholder="password"
          id="password"
          onChange={handleChange}
        />
        <TextInput
          defaultValue={currentUser?.country}
          type="text"
          placeholder="country"
          id="country"
          onChange={handleChange}
        />
        <TextInput
          defaultValue={currentUser?.phone}
          type="number"
          placeholder="phone number"
          id="phone"
          onChange={handleChange}
        />
        <Textarea
          defaultValue={currentUser?.description}
          placeholder="description"
          id="description"
          onChange={handleChange}
        />
        {userSkills.length > 0 && (
          <div className=" flex items-center gap-5 border p-3 border-gray-100">
            {userSkills &&
              userSkills.map((skill, index) => (
                <div
                  key={index}
                  className=" opacity-50 border p-3 rounded-lg flex items-center gap-2">
                  <p>{skill}</p>
                  <IoClose
                    onClick={() => handleSkillDlt(skill)}
                    className=" border rounded-full cursor-pointer hover:bg-red-500"
                  />
                </div>
              ))}
          </div>
        )}
        <div className="">
          <div className=" flex items-center gap-2">
            <TextInput
              onClick={() => setSkillError("")}
              value={userSkill}
              onChange={handleSkill}
              placeholder="skill"
            />
            <Button
              onClick={() => handleSkillBtn()}
              gradientDuoTone="purpleToBlue">
              Add
            </Button>
          </div>
          <span className=" text-gray-500 text-xs">max 25Letters</span>
          {skillError && (
            <Alert className=" mt-2" color="failure">
              {skillError}
            </Alert>
          )}
        </div>
        <Button
          type="submit"
          gradientDuoTone="purpleToBlue"
          outline
          disabled={false}>
          Update
        </Button>
      </form>
      {userUpdateError && (
        <Alert className=" text-center mt-5" color="failure">
          {userUpdateError}
        </Alert>
      )}
      {updateSuccessMsg && (
        <Alert color="success" className=" text-center mt-3">
          {" "}
          {updateSuccessMsg}
        </Alert>
      )}

      <div className=" text-red-500 flex items-center justify-between mt-3">
        <span
          onClick={() => setshowModal(!showModal)}
          className=" cursor-pointer">
          Delete account
        </span>
        <span onClick={handleSignout} className=" cursor-pointer">
          Sign Out
        </span>
      </div>
      <div className="">
        {toggle && (
          <Link to="/create-gig">
            <Button gradientDuoTone="purpleToBlue" className=" w-full mt-3">
              Create Gig
            </Button>
          </Link>
        )}
      </div>
      <div>
        <Modal
          show={showModal}
          onClose={() => setshowModal(false)}
          popup
          size="md">
          <Modal.Header />
          <Modal.Body>
            <div className="text-center">
              <HiOutlineExclamationCircle className=" h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto " />
              <div className=" text-lg text-gray-500 dark:text-gray-400">
                <h3>Are you sure you want to delete your accoun?</h3>
              </div>
              <div className="flex items-center justify-between mt-5">
                <Button color="failure" onClick={handleDelete}>
                  Yes.I'm sure
                </Button>
                <Button color="gray" onClick={() => setshowModal(!showModal)}>
                  No,cancel
                </Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
}
