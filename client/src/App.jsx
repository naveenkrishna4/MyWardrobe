import { useState, useEffect } from "react";

const app = () => {
  const [type, setType] = useState("");

  useEffect(() => {
    console.log(type);
  }, [type]);

  const handleclick = async (e) => {
    setType(e);
  };

  return (
    <div>
      <p className="text-3xl font-bold underline flex justify-center items-center mt-10 ">
        Select Type
      </p>
      <form className="text-2xl font-bold flex justify-center items-center mt-10 space-x-7">
        <div>
          <input
            type="radio"
            name="type"
            onClick={() => handleclick("casual")}
          ></input>
          <label>Casual</label>
        </div>
        <div>
          <input
            type="radio"
            name="type"
            onClick={() => handleclick("formal")}
          ></input>
          <label>Formal</label>
        </div>

        <div>
          <input
            type="radio"
            name="type"
            onClick={() => handleclick("traditional")}
          ></input>
          <label>Traditional</label>
        </div>

        <div>
          <input
            type="radio"
            name="type"
            onClick={() => handleclick("party")}
          ></input>
          <label>Party</label>
        </div>
      </form>
    </div>
  );
};

export default app;
