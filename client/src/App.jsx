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

const App = () => {
  const currentDate = new Date();
  const email = "nav@g.com";
  const [categories, setCategories] = useState([]);
  const [searchcategories, setSearchcategories] = useState([]);
  const [selected, setSelected] = useState(null);
  const [favourites, setFavourites] = useState([]);
  const [others, setOthers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDocuments = async () => {
      setLoading(true);
      const querySnapshot = await getDocs(
        query(
          collection(firestore, "posts"),
          where("email", "==", email),
          where("used", "==", false)
        )
      );
      const docs = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      if (docs.length === 0) {
        const allDocsSnapshot = await getDocs(
          query(collection(firestore, "posts"), where("email", "==", email))
        );
        allDocsSnapshot.forEach((doc) => {
          updateDoc(doc.ref, { used: false });
        });
        const allDocs = allDocsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setDocuments(allDocs);
      } else {
        setDocuments(docs);
      }
      setLoading(false);
    };

    const setDocuments = (docs) => {
      const favs = docs.filter((doc) => doc.favourite === true);
      const oths = docs.filter((doc) => doc.favourite !== true);
      setCategories([...new Set(docs.map((doc) => doc.category))]);
      setFavourites(favs);
      setOthers(oths);
    };

    fetchDocuments();
  }, []);

  const handleSubmit = async () => {
    try {
      let fvts = [];
      let oth = [];
      const q = query(
        collection(firestore, "posts"),
        where("email", "==", email),
        where("category", "in", searchcategories),
        where("used", "==", false),
        where("favourite", "==", true)
      );
      const res = await getDocs(q);
      res.forEach((doc) => {
        fvts.push({ id: doc.id, ...doc.data() });
      });
      const p = query(
        collection(firestore, "posts"),
        where("email", "==", email),
        where("category", "in", searchcategories),
        where("used", "==", false),
        where("favourite", "==", false)
      );
      const resu = await getDocs(p);
      resu.forEach((doc) => {
        oth.push({ id: doc.id, ...doc.data() });
      });
      console.log(fvts);
      if (fvts.length === 0 && oth.length === 0) {
        const allDocsSnapshot = await getDocs(
          query(
            collection(firestore, "posts"),
            where("email", "==", email),
            where("category", "in", searchcategories)
          )
        );
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
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    if (e.target.checked) {
      setSearchcategories((prevCheckedCategories) => [
        ...prevCheckedCategories,
        e.target.id,
      ]);
    } else {
      setSearchcategories((prevCheckedCategories) =>
        prevCheckedCategories.filter((cat) => cat !== e.target.id)
      );
    }
  };

  const handleSelect = async () => {
    try {
      const data = {
        email: selected.email,
        date: currentDate,
        category: selected.category,
        fav: selected.favourite,
        description: selected.description,
        title: selected.title,
        image: selected.image,
      };
      await addDoc(collection(firestore, "Data"), data);
      await updateDoc(doc(firestore, "posts", selected.id), { used: true });
      window.alert("success");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row">
      {loading && <p className="text-3xl text-center p-10">Loading...</p>}
      {!loading && (
        <div className="p-4 border-b-2 md:border-r-2 md:min-h-screen">
          <p className="text-3xl font-bold underline flex justify-center items-center mt-5 ">
            Categories
          </p>
          <form className="text-xl flex flex-col gap-5 justify-center items-center mt-10">
            <div>
              {categories &&
                categories.map((category) => (
                  <div key={category} className="gap-2 flex flex-wrap">
                    <input
                      type="checkbox"
                      name="type"
                      id={category}
                      onChange={handleChange}
                    ></input>
                    <label>{category}</label>
                  </div>
                ))}
            </div>
            <button
              className="text-2xl font-bold border-4 px-2 border-gray-500 mb-5 "
              onClick={(e) => {
                e.preventDefault();
                if (searchcategories.length === 0)
                  window.alert("select atleast one category");
                else handleSubmit();
              }}
            >
              Display
            </button>
          </form>
        </div>
      )}
      {!loading && (
        <div className=" p-5">
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
                    key={data.id + "_favourite"}
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
                        {data.category}
                      </h3>
                    </div>
                    <br></br>
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
          {others.length > 0 && (
            <div>
              <p className="text-1xl font-bold underline flex justify-center items-center mt-5">
                Others
              </p>
              <div className="flex flex-wrap justify-center items-center mt-4">
                {others.map((data) => (
                  <div
                    className="item"
                    key={data.id + "_other"}
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
                        {data.category}
                      </h3>
                    </div>
                    <br></br>
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
                onClick={handleSelect}
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

export default App;
