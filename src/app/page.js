// import ExamList from "../../components/ExamList";
// export default function Page(props) {
//   console.log("props ---->", props);
//   return (
//     <main className="flex  flex-col items-center">
//       <ExamList />
//     </main>
//   );
// }

import React from "react";
import ExamList from "../../components/ExamList";

async function getExamList() {
  const res = await fetch(
    `https://coding-challenge-web.vercel.app/api/exam-papers?participant=7e1MDHttqqD8G2UeV0hH`
  );
  return res.json();
}

const Page = async () => {
  const examList = getExamList();
  const [list] = await Promise.all([examList]);
  return (
    <main className="flex flex-col items-center">
      <ExamList examList={list} />
    </main>
  );
};

// export async function getServerSideProps() {
//   try {
//     const res = await fetch(
//       "https://coding-challenge-web.vercel.app/api/exam-papers?participant=7e1MDHttqqD8G2UeV0hH"
//     );
//     const data = await res.json();

//     console.log("data ====>", data);

//     return { props: { data } };
//   } catch (error) {
//     console.error("Error fetching data:", error);
//     return { props: { data: null } };
//   }
// }

// export async function getServerSideProps() {
//   try {
//     const res = await fetch(
//       "https://coding-challenge-web.vercel.app/api/exam-papers?participant=7e1MDHttqqD8G2UeV0hH"
//     );
//     const data = await res.json();

//     console.log("data ====>", data);

//     return { props: { data } };
//   } catch (error) {
//     console.error("Error fetching data:", error);
//     return { props: { data: null } };
//   }
// }

export default Page;
