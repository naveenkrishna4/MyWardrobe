import { useState, useEffect } from "react";
import "./App.css";
import { firestore } from "./firebase-config.js";
import {
  getDocs,
  collection,
  query,
  where,
  doc,
  updateDoc,
  addDoc,
} from "firebase/firestore";

const app = () => {
  const currentDate = new Date();
  const userid = "1234";
  const [type, setType] = useState("");
  const [selected, setSelected] = useState(null);
  const [favourites, setFavourites] = useState([]);
  const [others, setOthers] = useState([]);
  const [clicked, setclicked] = useState(false);

  const handleSubmit = async (type) => {
    try {
      let fvts = [];
      let oth = [];
      const q = query(
        collection(firestore, "posts"),
        where("userid", "==", userid),
        where("category", "==", type),
        where("used", "==", false),
        where("favourite", "==", true)
      );
      const res = await getDocs(q);
      res.forEach((doc) => {
        fvts.push({ id: doc.id, ...doc.data() });
      });
      const p = query(
        collection(firestore, "posts"),
        where("userid", "==", userid),
        where("category", "==", type),
        where("used", "==", false),
        where("favourite", "==", false)
      );
      const resu = await getDocs(p);
      resu.forEach((doc) => {
        oth.push({ id: doc.id, ...doc.data() });
      });
      if (fvts.length === 0 && oth.length === 0) {
        const allDocsQuery = query(
          collection(firestore, "posts"),
          where("userid", "==", userid),
          where("category", "==", type)
        );
        const allDocsSnapshot = await getDocs(allDocsQuery);
        allDocsSnapshot.forEach((doc) => {
          updateDoc(doc.ref, { used: false });
          const fav = doc.data().favourite;
          if (fav === false) {
            oth.push({ id: doc.id, ...doc.data() });
          } else {
            fvts.push({ id: doc.id, ...doc.data() });
          }
        });
      }
      setFavourites(fvts);
      setOthers(oth);
      setclicked(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSelect = async () => {
    try {
      const data = {
        userid: selected.userid,
        date: currentDate,
        category: selected.category,
        fav: selected.favourite,
        description: selected.description,
        title: selected.title,
        image: selected.image,
      };
      const docRef = await addDoc(collection(firestore, "Data"), data);
      const selectedDocRef = await doc(firestore, "posts", selected.id);
      const up = await updateDoc(selectedDocRef, { used: true });
      window.alert("success");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div>
        <p className="text-3xl font-bold underline flex justify-center items-center mt-5 ">
          Select Type
        </p>
        <form className="text-2xl font-bold flex justify-center items-center mt-10 space-x-7">
          <div>
            <input
              type="radio"
              name="type"
              onClick={() => setType("casual")}
            ></input>
            <label>Casual</label>
          </div>
          <div>
            <input
              type="radio"
              name="type"
              onClick={() => setType("formal")}
            ></input>
            <label>Formal</label>
          </div>

          <div>
            <input
              type="radio"
              name="type"
              onClick={() => setType("traditional")}
            ></input>
            <label>Traditional</label>
          </div>

          <div>
            <input
              type="radio"
              name="type"
              onClick={() => setType("party")}
            ></input>
            <label>Party</label>
          </div>
        </form>
        <div className="flex justify-center items-center mt-5">
          <button
            type="submit"
            className="text-2xl font-bold border-4 px-2 border-gray-500 mb-5 "
            onClick={() => {
              if (type === "") window.alert("select a type");
              else handleSubmit(type);
            }}
          >
            Display
          </button>
        </div>
      </div>
      {clicked && (
        <div>
          <p className="text-2xl font-bold underline flex justify-center items-center mt-5">
            Your Collections
          </p>
          {favourites.length > 0 && (
            <div>
              <p className="text-1xl font-bold underline flex justify-center items-center mt-5">
                Your Favorites
              </p>
              <div className="flex flex-wrap justify-center items-center mt-4 ">
                {favourites.map((data) => (
                  <div
                    className="item"
                    key={data.id}
                    onClick={() => setSelected(data)}
                  >
                    <div className="intro">
                      <img className="banner" src={data.image} alt="" />
                    </div>
                    <div className="group">
                      <p className="item-category">{data.title}</p>
                    </div>
                    <br />
                    <div className="group">
                      <h3 id="h33" name="h33" className="item-desc">
                        {data.description}
                      </h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          <br></br>
          {others.length > 0 && (
            <div>
              <p className="text-1xl font-bold underline flex justify-center items-center mt-5">
                Others
              </p>
              <div className="flex flex-wrap justify-center items-center mt-4">
                {others.map((data) => (
                  <div
                    className="item"
                    key={data.id}
                    onClick={() => setSelected(data)}
                  >
                    <div className="intro">
                      <img className="banner" src={data.image} alt="" />
                    </div>
                    <div className="group">
                      <p className="item-category">{data.title}</p>
                    </div>
                    <br />
                    <div className="group">
                      <h3 id="h33" name="h33" className="item-desc">
                        {data.description}
                      </h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {favourites.length === 0 && others.length === 0 && (
            <p className="flex justify-center items-center mt-5 text-1xl font-bold">
              Empty
            </p>
          )}
          <br></br>
          {(favourites.length > 0 || others.length > 0) && (
            <div className="flex justify-center items-center mt-5">
              <button
                className="text-2xl font-bold border-4 px-2 border-gray-500 mb-5"
                onClick={() => {
                  handleSelect();
                }}
              >
                Select
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default app;
