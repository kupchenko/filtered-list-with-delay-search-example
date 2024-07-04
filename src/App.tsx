import React from "react";
import {useEffect, useState, useMemo} from "react";
import faker from "faker";

export async function getNamesApi() {
  return Array.from(Array(500), () => {
    return faker.name.findName();
  });
}

function debounce(func: (val: string) => void, timeout = 1000) {
  let timer: any;
  return (val: string) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(val), timeout);
  };
}

export function App() {
  const [searchName, setSearchName] = useState<string>("");
  const [allNames, setAllNames] = useState<Array<string>>([]);
  const [filteredNames, setFilteredNames] = useState<Array<string>>([]);

  useEffect(() => {
    const fetchData = async () => {
      const namesResponse = await getNamesApi();
      setAllNames(namesResponse);
      setFilteredNames(namesResponse);
    };
    fetchData();
  }, []);

  const search = useMemo(
    () =>
      debounce((text: string) => {
        console.log("Filtering", text);
        setSearchName(text);
      }),
    []
  );

  useEffect(() => {
    if (searchName) {
      const names = allNames.filter((name: string) =>
        name.toLowerCase().includes(searchName.toLowerCase())
      );
      setFilteredNames(names);
    } else {
      setFilteredNames(allNames);
    }
  }, [searchName, allNames]);

  return (
    <>
      <div>
        <input
          onChange={(event) => search(event.target.value)}
          placeholder="Enter name"
        />
      </div>
      {filteredNames.map((name, id) => {
        return (
          <>
            <div>{name}</div>
          </>
        );
      })}
    </>
  );
}


export default App;
