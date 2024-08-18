"use client";
import { Box, Button, Stack, Typography } from "@mui/material";
import React, { useState, useCallback } from "react";
import Cards from "@/components/Cards";
import useEmblaCarousel from "embla-carousel-react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

export default function DisplayCard({ title }) {
  // sample data
  const [data, setData] = useState([
    { front: "front1", back: "back1" },
    { front: "front2", back: "back2" },
  ]);

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  // get the all the flashcards from the db

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
    >
      <Box
        width="90vw"
        height="90vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
      >
        <Stack
          width="100%"
          height="100%"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          spacing={2}
        >
          <Box width="100%" height="10%">
            <Typography variant="h2">{title}</Typography>
          </Box>
          <Box
            width="100%"
            height="90%"
            display="flex"
            flexDirection="row"
            justifyContent="center"
            alignItems="center"
          >
            <Stack
              width="100%"
              height="75%"
              display="flex"
              flexDirection="row"
              justifyContent="center"
              alignItems="center"
              spacing={2}
            >
              <Button
                sx={{
                  color: "black",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                className="embla__prev"
                onClick={scrollPrev}
              >
                <Typography>
                  <FaArrowLeft />
                </Typography>
              </Button>
              <Box
                width="100%"
                height="100%"
                display="flex"
                justifyContent="center"
                alignItems="center"
                className="embla"
              >
                <Box
                  width="100%"
                  height="100%"
                  flexDirection="column"
                  className="embla__viewport"
                  ref={emblaRef}
                >
                  <Box width="100%" height="100%" className="embla__container">
                    {data.map((item, index) => (
                      <Box
                        className="embla__slide"
                        key={index}
                        width="100%"
                        height="100%"
                        display="flex"
                        flexDirection="column"
                        justifyContent="center"
                        alignItems="center"
                      >
                        <Cards front={item.front} back={item.back} />
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>
              <Button
                sx={{ color: "black" }}
                className="embla__next"
                onClick={scrollNext}
              >
                <Typography>
                  <FaArrowRight />
                </Typography>
              </Button>
            </Stack>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}
