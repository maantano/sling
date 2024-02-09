"use client";
import * as React from "react";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import ButtonBase from "@mui/material/ButtonBase";
import { usePathname, useRouter } from "next/navigation";
const Img = styled("img")({
  display: "block",
  maxWidth: "100%",
  maxHeight: "100%",
  padding: "20px",
});

export default function ExamItem({ data }) {
  console.log("data ===>", data);
  const router = useRouter();
  const path = usePathname();

  const toLink = () => {
    router.push(`/detail/${props.id}`);
  };
  // "https://storage.googleapis.com/giyoung.appspot.com/images/examTemplates/08OnLDgsDcjgl3AiJcU1/explanation.pdf"
  // "https://storage.googleapis.com/giyoung.appspot.com/images/examTemplates/1Yc8l0q2V63ynPK1n00c/explanation.pdf"
  // 1Yc8l0q2V63ynPK1n00c
  // /api/exam-paper/[id]?participant=지원자ID
  // https://coding-challenge-web.vercel.app/api/exam-paper/[id]?participant=지원자ID
  // https://coding-challenge-web.vercel.app/api/exam-paper/1Yc8l0q2V63ynPK1n00c?participant=7e1MDHttqqD8G2UeV0hH

  return (
    <Paper
      onClick={toLink}
      sx={{
        p: 2,
        maxWidth: 800,
        width: 600,
        marginBottom: 5,
        backgroundColor: (theme) =>
          theme.palette.mode === "dark" ? "#1A2027" : "#fff",
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
        transition:
          "background-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease",
        "&:hover": {
          backgroundColor: (theme) =>
            theme.palette.mode === "dark" ? "#0D1116" : "#f5f5f5",
          boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.2)",
          transform: "translateY(-2px)",
        },
      }}
    >
      <Grid
        container
        spacing={5}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Grid item>
          <ButtonBase sx={{ width: 128, height: 128 }}>
            <Img alt="complex" src="/favicon.ico" />
          </ButtonBase>
        </Grid>
        <Grid item xs={12} sm container>
          <Grid item xs container direction="column" spacing={2}>
            <Grid item xs>
              <Typography gutterBottom variant="subtitle1" component="div">
                제목 : {data.shortTitle}
              </Typography>
              <Typography variant="body2" gutterBottom>
                시험 년도 : {data.executionYear}년
              </Typography>
              <Typography variant="body2" color="text.secondary">
                영역 : {data.section.name}, 과목 : {data.subject.name}
              </Typography>
            </Grid>
            {/* <Grid item>
              <Typography sx={{ cursor: "pointer" }} variant="body2">
                Remove
              </Typography>
            </Grid> */}
          </Grid>
          <Grid item>
            <Typography variant="subtitle1" component="div">
              공개 여부 : {data.isVisible ? "공개" : "비공개"}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}
