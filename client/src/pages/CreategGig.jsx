import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  FileInput,
  Modal,
  Select,
  Table,
  TextInput,
  Textarea,
} from "flowbite-react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { app } from "../firebase";
import { IoClose } from "react-icons/io5";
import { useSelector } from "react-redux";
import axios from "axios";
import { FaCircleCheck } from "react-icons/fa6";

export default function CreategGig() {
  const [formdata, setFormdata] = useState({ images: [] });
  const [navigateBtn, setNavigateBtn] = useState(1);
  const [btnOneSuccess, setBtnOneSuccess] = useState(false);
  const [btnTwoSuccess, setBtnTwoSuccess] = useState(false);
  const [file, setFile] = useState(null);
  const [uploadImageProgress, setUploadImageProgress] = useState(0);
  const [imageUploadError, setImageUploadError] = useState("");
  const [formDataError, setFormDataError] = useState("");
  const { currentUser } = useSelector((state) => state.userState);
  const [showModal, setshowModal] = useState(false);
  const [gigError, setGigError] = useState(null);

  console.log(formdata);

  const handleImage = () => {
    try {
      if (!file) {
        setImageUploadError("Please select an image");
        return;
      }
      setImageUploadError("");
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
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
          setUploadImageProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
            setUploadImageProgress(null);
            setImageUploadError("");

            setFormdata({
              ...formdata,
              images: formdata.images.concat(downloadUrl),
            });
          });
        }
      );
    } catch (error) {
      setImageUploadError("Image upload failed");
      setUploadImageProgress(null);
      console.log("handleImageError", error);
    }
  };
  const handleGigImage = (image) => {
    setFormdata(formdata.images.filter((img) => img !== image));
  };

  const hadleContinueBtn = () => {
    if (!formdata.title || !formdata.descriptiion || !formdata.category) {
      setFormDataError("Please fill in the informations!");
      return;
    }
    setBtnOneSuccess(true);
    setNavigateBtn(2);
  };
  //New Seller", "Level 1", "Level 2", "Top Rated"
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentUser.level === "New Seller") {
      if (formdata.images.length > 3) {
        setImageUploadError("maxmium 3 images are allowed ");
        return;
      }
    }
    if (currentUser.level === "Level 1") {
      if (formdata.images.length > 5) {
        setImageUploadError("maxmium 5 images are allowed");
        return;
      }
    }
    if (currentUser.level === "Level 2") {
      if (formdata.images.length > 7) {
        setImageUploadError("maxmium 7 images are allowed");
        return;
      }
    }
    if (currentUser.level === "Top Rated") {
      if (formdata.images.length > 10) {
        setImageUploadError("maxmium 10 images are allowed");
        return;
      }
    }
    try {
      const { data } = await axios.post(
        `/api/gig/creategig/${currentUser._id}`,
        formdata
      );
      console.log(data);
      if (data) {
        setshowModal(true);
      }
    } catch (error) {
      setGigError(error.response.data);
      console.log("createGigError", error);
    }
  };

  return (
    <>
      <div className=" max-w-3xl min-h-screen mx-auto p-3 sm:pb-0">
        <h1 className=" text-2xl font-semibold text-center mt-3 ">
          Craete a GiG
        </h1>
        <div className=" flex justify-center gap-5 mt-4">
          <Button
            className={`  rounded-full bg-gray-400 dark:bg-gray-500 ${
              btnOneSuccess && "bg-green-600 dark:bg-green-500"
            } `}>
            1
          </Button>
          <Button
            className={` rounded-full  bg-gray-400 dark:bg-gray-500  ${
              btnTwoSuccess && "bg-green-600 dark:bg-green-500"
            } `}>
            2
          </Button>
        </div>
        {/* btn 1 */}
        {navigateBtn === 1 && (
          <form className="flex flex-col gap-5 mt-4">
            <div className=" flex flex-col gap-4 ">
              <TextInput
                className=" w-full"
                placeholder="Title"
                type="text"
                required
                id="title"
                onChange={(e) =>
                  setFormdata({ ...formdata, title: e.target.value })
                }
              />
              <Textarea
                required
                placeholder="description"
                onChange={(e) =>
                  setFormdata({ ...formdata, descriptiion: e.target.value })
                }
              />
              <Select
                required
                className=" w-full"
                onChange={(e) =>
                  setFormdata({ ...formdata, category: e.target.value })
                }>
                <option value="uncategorized">Select a category</option>
                <option value="SoftwareDevelopment">
                  Software Development
                </option>
                <option value="Graphic Designing"> Graphic Designing</option>
                <option value="Video Editing">Video Editing</option>
              </Select>
            </div>
            <Button
              onClick={hadleContinueBtn}
              gradientDuoTone="purpleToBlue"
              outline>
              Save and Continue
            </Button>
            {formDataError && <Alert color="failure">{formDataError}</Alert>}
          </form>
        )}

        {navigateBtn === 2 && (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5 mt-4">
            <div className=" border-4 border-dotted border-teal-500 p-3 flex items-center gap-4">
              <FileInput
                required
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files[0])}
              />
              <Button
                gradientDuoTone="purpleToBlue"
                outline
                onClick={handleImage}>
                {uploadImageProgress ? (
                  <div className=" w-16 h-16">
                    <CircularProgressbar
                      value={uploadImageProgress}
                      text={`${uploadImageProgress || 0}%`}
                    />
                  </div>
                ) : (
                  <span>Upload Image</span>
                )}
              </Button>
            </div>
            {/* //New Seller", "Level 1", "Level 2", "Top Rated" */}

            {currentUser.level === "New Seller" && (
              <span className=" text-gray-400 text-xs">
                {" "}
                maximum 3 images are allowd
              </span>
            )}
            {currentUser.level === "Level 1" && (
              <span className=" text-gray-400 text-xs">
                {" "}
                maximum 5 images are allowd
              </span>
            )}
            {currentUser.level === "Level 2" && (
              <span className=" text-gray-400 text-xs">
                {" "}
                maximum 7 images are allowd
              </span>
            )}
            {currentUser.level === "Top Rated" && (
              <span className=" text-gray-400 text-xs">
                {" "}
                maximum 10 images are allowd
              </span>
            )}
            <div className=" flex items-center gap-4">
              {formdata?.images?.map((image) => (
                <div className=" flex items-center gap-2 ">
                  <img
                    src={image}
                    alt="gigs image"
                    className=" w-20 h-20 object-cover rounded-lg"
                  />
                  <IoClose
                    onClick={() => handleGigImage(image)}
                    size={22}
                    className=" border rounded-full hover:bg-red-500"
                  />
                </div>
              ))}
            </div>
            {imageUploadError && (
              <Alert color="failure"> {imageUploadError} </Alert>
            )}
            {gigError && <Alert color="failure">{gigError}</Alert>}
            <div className="">
              <Table>
                <Table.Head>
                  <Table.HeadCell> Base </Table.HeadCell>
                  <Table.HeadCell> Silver </Table.HeadCell>
                  <Table.HeadCell> Platinum </Table.HeadCell>
                </Table.Head>
                <Table.Body className=" ">
                  <Table.Row>
                    <Table.Cell>
                      <TextInput
                        className=" w-full"
                        placeholder="base title"
                        type="text"
                        required
                        id="title"
                        onChange={(e) =>
                          setFormdata({
                            ...formdata,
                            base: {
                              ...formdata.base,
                              baseTitle: e.target.value,
                            },
                          })
                        }
                      />
                    </Table.Cell>
                    <Table.Cell>
                      <TextInput
                        className=" w-full"
                        placeholder="silver title"
                        type="text"
                        required
                        id="title"
                        onChange={(e) =>
                          setFormdata({
                            ...formdata,
                            silver: {
                              ...formdata.silver,
                              silverTitle: e.target.value,
                            },
                          })
                        }
                      />
                    </Table.Cell>
                    <Table.Cell>
                      <TextInput
                        className=" w-full"
                        placeholder="platinum title"
                        type="text"
                        required
                        id="title"
                        onChange={(e) =>
                          setFormdata({
                            ...formdata,
                            platinum: {
                              ...formdata.platinum,
                              platinumTitle: e.target.value,
                            },
                          })
                        }
                      />
                    </Table.Cell>
                  </Table.Row>

                  <Table.Row>
                    <Table.Cell>
                      <Textarea
                        required
                        placeholder="description"
                        onChange={(e) =>
                          setFormdata({
                            ...formdata,
                            base: {
                              ...formdata.base,
                              baseDescription: e.target.value,
                            },
                          })
                        }
                      />
                    </Table.Cell>
                    <Table.Cell>
                      <Textarea
                        required
                        placeholder="description"
                        onChange={(e) =>
                          setFormdata({
                            ...formdata,
                            silver: {
                              ...formdata.silver,
                              silverDescription: e.target.value,
                            },
                          })
                        }
                      />
                    </Table.Cell>
                    <Table.Cell>
                      <Textarea
                        required
                        placeholder="description"
                        onChange={(e) =>
                          setFormdata({
                            ...formdata,
                            platinum: {
                              ...formdata.platinum,
                              platinumDescription: e.target.value,
                            },
                          })
                        }
                      />
                    </Table.Cell>
                  </Table.Row>

                  <Table.Row>
                    <Table.Cell>
                      <div className=" flex items-center gap-1">
                        <span>$</span>
                        <TextInput
                          className=" w-full"
                          placeholder="price"
                          type="number"
                          required
                          id="title"
                          onChange={(e) =>
                            setFormdata({
                              ...formdata,
                              base: {
                                ...formdata.base,
                                basePrice: e.target.value,
                              },
                            })
                          }
                        />
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <div className=" flex items-center gap-1">
                        <span>$</span>
                        <TextInput
                          className=" w-full"
                          placeholder="price"
                          type="number"
                          required
                          id="title"
                          onChange={(e) =>
                            setFormdata({
                              ...formdata,
                              silver: {
                                ...formdata.silver,
                                silverPrice: e.target.value,
                              },
                            })
                          }
                        />
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <div className=" flex items-center gap-1">
                        <span>$</span>
                        <TextInput
                          className=" w-full"
                          placeholder="price"
                          type="number"
                          required
                          id="title"
                          onChange={(e) =>
                            setFormdata({
                              ...formdata,
                              platinum: {
                                ...formdata.platinum,
                                platinumPrice: e.target.value,
                              },
                            })
                          }
                        />
                      </div>
                    </Table.Cell>
                  </Table.Row>

                  <Table.Row>
                    <Table.Cell>
                      <TextInput
                        className=" w-full"
                        placeholder="revisions"
                        type="number"
                        required
                        id="title"
                        onChange={(e) =>
                          setFormdata({
                            ...formdata,
                            base: {
                              ...formdata.base,
                              baseRevision: e.target.value,
                            },
                          })
                        }
                      />
                    </Table.Cell>
                    <Table.Cell>
                      <TextInput
                        className=" w-full"
                        placeholder="revisions"
                        type="number"
                        required
                        id="title"
                        onChange={(e) =>
                          setFormdata({
                            ...formdata,
                            silver: {
                              ...formdata.silver,
                              silverRevision: e.target.value,
                            },
                          })
                        }
                      />
                    </Table.Cell>
                    <Table.Cell>
                      <TextInput
                        className=" w-full"
                        placeholder="revisions"
                        type="number"
                        required
                        id="title"
                        onChange={(e) =>
                          setFormdata({
                            ...formdata,
                            platinum: {
                              ...formdata.platinum,
                              platinumRevision: e.target.value,
                            },
                          })
                        }
                      />
                    </Table.Cell>
                  </Table.Row>

                  <Table.Row>
                    <Table.Cell>
                      <TextInput
                        className=" w-full"
                        placeholder="delivery"
                        type="number"
                        required
                        id="title"
                        onChange={(e) =>
                          setFormdata({
                            ...formdata,
                            base: {
                              ...formdata.base,
                              baseDays: e.target.value,
                            },
                          })
                        }
                      />
                    </Table.Cell>
                    <Table.Cell>
                      <TextInput
                        className=" w-full"
                        placeholder="delivery"
                        type="number"
                        required
                        id="title"
                        onChange={(e) =>
                          setFormdata({
                            ...formdata,
                            silver: {
                              ...formdata.silver,
                              silverDays: e.target.value,
                            },
                          })
                        }
                      />
                    </Table.Cell>
                    <Table.Cell>
                      <TextInput
                        className=" w-full"
                        placeholder="delivery"
                        type="number"
                        required
                        id="title"
                        onChange={(e) =>
                          setFormdata({
                            ...formdata,
                            platinum: {
                              ...formdata.platinum,
                              platinumDays: e.target.value,
                            },
                          })
                        }
                      />
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
            </div>
            <Button gradientDuoTone="purpleToBlue" outline type="submit">
              Create a GiG
            </Button>
          </form>
        )}
      </div>
      <Modal
        show={showModal}
        onClose={() => setshowModal(false)}
        popup
        size="md">
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <FaCircleCheck className=" h-14 w-14 text-green-400 dark:text-green-400 mb-4 mx-auto " />
            <div className=" text-lg text-gray-500 dark:text-gray-400">
              <h3>Success</h3>
            </div>
            <div className="">
              <p>
                Please wait for your gig to be approved <span>(24h)</span>
              </p>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
