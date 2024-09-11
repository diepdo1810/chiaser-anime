import React from "react";
import StarFill from "@/public/assets/star-fill.svg";
import StarHalf from "@/public/assets/star-half.svg";
import Star from "@/public/assets/star.svg";
import AnilistSvg from "@/public/assets/anilist.svg";
import ImdbSvg from "@/public/assets/imdb.svg";
import OTruyenSvg from "@/public/assets/oTruyen.svg";
import styles from "./component.module.css";

export default function ScoreRating({
  ratingScore,
  ratingType,
  source,
}: {
  readonly ratingScore: number;
  readonly ratingType?: "stars" | "string";
  readonly source?: "anilist" | "imdb" | "otruyen";
}) {
  const sourceNameFirstLetterUpperCase = source
    ? source.slice(0, 1).toUpperCase() + source.slice(1)
    : undefined;

  let maxScore;
  if (source === "anilist" || source === "otruyen") {
    maxScore = "5";
  } else {
    maxScore = "10";
  }
  
  const containerTitle = `${sourceNameFirstLetterUpperCase} Score: ${ratingScore} out of ${maxScore}`;

  return (
    <span className={styles.container} title={containerTitle}>
      <RatingSourceIcon sourceName={source} />

      {/* STRING RATING TYPE */}
      {ratingType == "string" && (
        <p className={styles.rating_on_line}>{ratingScore}/10</p>
      )}

      {/* STARS RATING TYPE */}
      {/* 5 to 4 */}
      {(!ratingType || ratingType == "stars") && ratingScore == 5 && (
        <>
          <StarFill width={16} height={16} />
          <StarFill width={16} height={16} />
          <StarFill width={16} height={16} />
          <StarFill width={16} height={16} />
          <StarFill width={16} height={16} />
        </>
      )}

      {(!ratingType || ratingType == "stars") &&
        ratingScore >= 4.5 &&
        ratingScore < 5 && (
          <>
            <StarFill width={16} height={16} />
            <StarFill width={16} height={16} />
            <StarFill width={16} height={16} />
            <StarFill width={16} height={16} />
            <StarHalf width={16} height={16} />
          </>
        )}

      {(!ratingType || ratingType == "stars") &&
        ratingScore >= 4 &&
        ratingScore < 4.5 && (
          <>
            <StarFill width={16} height={16} />
            <StarFill width={16} height={16} />
            <StarFill width={16} height={16} />
            <StarFill width={16} height={16} />
            <Star width={16} height={16} />
          </>
        )}

      {/* 4 to 3*/}
      {(!ratingType || ratingType == "stars") &&
        ratingScore >= 3.5 &&
        ratingScore < 4 && (
          <>
            <StarFill width={16} height={16} />
            <StarFill width={16} height={16} />
            <StarFill width={16} height={16} />
            <StarHalf width={16} height={16} />
            <Star width={16} height={16} />
          </>
        )}

      {(!ratingType || ratingType == "stars") &&
        ratingScore >= 3 &&
        ratingScore < 3.5 && (
          <>
            <StarFill width={16} height={16} />
            <StarFill width={16} height={16} />
            <StarFill width={16} height={16} />
            <Star width={16} height={16} />
            <Star width={16} height={16} />
          </>
        )}

      {/* 3 to 2 */}
      {(!ratingType || ratingType == "stars") &&
        ratingScore >= 2.5 &&
        ratingScore < 3 && (
          <>
            <StarFill width={16} height={16} />
            <StarFill width={16} height={16} />
            <StarHalf width={16} height={16} />
            <Star width={16} height={16} />
            <Star width={16} height={16} />
          </>
        )}

      {(!ratingType || ratingType == "stars") &&
        ratingScore >= 2 &&
        ratingScore < 2.5 && (
          <>
            <StarFill width={16} height={16} />
            <StarFill width={16} height={16} />
            <Star width={16} height={16} />
            <Star width={16} height={16} />
            <Star width={16} height={16} />
          </>
        )}

      {/* 2 to 1 */}
      {(!ratingType || ratingType == "stars") &&
        ratingScore >= 1.5 &&
        ratingScore < 2 && (
          <>
            <StarFill width={16} height={16} />
            <StarHalf width={16} height={16} />
            <Star width={16} height={16} />
            <Star width={16} height={16} />
            <Star width={16} height={16} />
          </>
        )}

      {(!ratingType || ratingType == "stars") &&
        ratingScore > 1 &&
        ratingScore < 1.5 && (
          <>
            <StarFill width={16} height={16} />
            <Star width={16} height={16} />
            <Star width={16} height={16} />
            <Star width={16} height={16} />
            <Star width={16} height={16} />
          </>
        )}

      {/* 1 to 0 */}
      {(!ratingType || ratingType == "stars") && ratingScore == 1 && (
        <>
          <StarFill width={16} height={16} />
          <Star width={16} height={16} />
          <Star width={16} height={16} />
          <Star width={16} height={16} />
          <Star width={16} height={16} />
        </>
      )}

      {(!ratingType || ratingType == "stars") &&
        ratingScore >= 0.5 &&
        ratingScore < 1 && (
          <>
            <StarHalf width={16} height={16} />
            <Star width={16} height={16} />
            <Star width={16} height={16} />
            <Star width={16} height={16} />
            <Star width={16} height={16} />
          </>
        )}

      {(!ratingType || ratingType == "stars") &&
        ratingScore > 0 &&
        ratingScore < 0.5 && (
          <>
            <StarHalf width={16} height={16} />
            <Star width={16} height={16} />
            <Star width={16} height={16} />
            <Star width={16} height={16} />
            <Star width={16} height={16} />
          </>
        )}
    </span>
  );
}

function RatingSourceIcon({ sourceName }: { readonly sourceName?: "anilist" | "imdb" | "otruyen" }) {
  switch (sourceName) {
    case "anilist":
      return (
        <span className={styles.source} style={{ background: "#1d252e" }}>
          <AnilistSvg
            fill={"#02a9ff"}
            width={24}
            height={24}
            alt={"Anilist Icon"}
            title={"Anilist"}
          />
        </span>
      );

    case "imdb":
      return (
        <span className={styles.source} style={{ background: "#e6b91e" }}>
          <ImdbSvg
            fill={"#000000"}
            width={24}
            height={24}
            alt={"Imdb Icon"}
            title={"Imdb"}
          />
        </span>
      );

    case "otruyen":
      return (
        <span className={styles.source} style={{ background: "#e6b91e" }}>
          <OTruyenSvg
            fill={"#000000"}
            width={25}
            height={25}
            alt={"OTruyen Icon"}
            title={"OTruyen"}
          />
        </span>
      );

    default:
      return;
  }
}
