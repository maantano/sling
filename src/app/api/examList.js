export default async function examList(req, res) {
  try {
    const participant = req.query.participant;
    const fetchUrl = `https://coding-challenge-web.vercel.app/api/exam-papers?participant=${participant}`;

    const fetchResponse = await fetch(fetchUrl);
    const data = await fetchResponse.json();

    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Error fetching data" });
  }
}
