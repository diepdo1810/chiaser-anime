"use client";
import React, { useEffect, useState } from "react";
import styles from "./component.module.css";
import {
  getFirestore,
  doc,
  setDoc,
  DocumentData,
  QueryDocumentSnapshot,
  collection,
  getDocs,
  where,
  query,
} from "firebase/firestore";
import { initFirebase } from "@/app/firebaseApp";
import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import CommentContainer from "./components/CommentContainer";
import SvgLoading from "@/public/assets/ripple-1s-200px.svg";
import SvgFilter from "@/public/assets/filter-right.svg";
import WriteCommentFormContainer from "./components/WriteCommentForm";
import { useAppDispatch, useAppSelector } from "@/app/lib/redux/hooks";
import { UserComment } from "@/app/ts/interfaces/firestoreDataInterface";
import { toggleShowLoginModalValue } from "@/app/lib/redux/features/loginModal";
import { MangaResponse } from "@/app/ts/interfaces/apiOMangaDataInterface";

type CommentsSectionTypes = {
  mangaInfo: MangaResponse["data"]["item"];
  mangaSlug: string;
  isOnReadPage?: boolean;
  chapterId?: string;
  chapterNumber?: number;
};

export default function CommentsSection({
  mangaInfo,
  mangaSlug,
  isOnReadPage,
  chapterId,
  chapterNumber,
}: CommentsSectionTypes) {
  const [commentsList, setCommentsList] = useState<DocumentData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [commentsSliceRange, setCommentsSliceRange] = useState<number>(3);

  const dispatch = useAppDispatch();
  const auth = getAuth();
  const [user] = useAuthState(auth);

  const db = getFirestore(initFirebase());

  useEffect(() => {
    getCommentsForManga();
  }, [mangaInfo, user, chapterId]);

  function handleCommentsSliceRange() {
    setCommentsSliceRange(commentsSliceRange + 10);
  }

  async function handleCommentsSortBy(
    sortBy: "date" | "likes" | "dislikes",
    commentsUnsorted?: DocumentData[]
  ) {
    setIsLoading(true);

    if (!commentsUnsorted) commentsUnsorted = await getCommentsForManga();

    let sortedComments;

    switch (sortBy) {
      case "date":
        sortedComments = commentsUnsorted!.sort(
          (x, y) => y.createdAt - x.createdAt
        );
        setCommentsList(sortedComments);
        break;

      case "likes":
        sortedComments = commentsUnsorted!.sort((x, y) => y.likes - x.likes);
        setCommentsList(sortedComments);
        break;

      case "dislikes":
        sortedComments = commentsUnsorted!.sort(
          (x, y) => y.dislikes - x.dislikes
        );
        setCommentsList(sortedComments);
        break;

      default:
        sortedComments = commentsUnsorted!.sort(
          (x, y) => y.createdAt - x.createdAt
        );
        setCommentsList(sortedComments);
        break;
    }

    setIsLoading(false);
  }

  async function getCommentsForManga() {
    setIsLoading(true);

    let mangaComments = await getDocs(
      collection(
        db,
        "comments",
        `${mangaInfo._id}`,  // Lấy theo manga ID từ oManga
        isOnReadPage ? `${chapterId}` : "all"
      )
    );

    if (!mangaComments) {
      await setDoc(doc(db, "comments", `${mangaInfo._id}`), {});
      mangaComments = await getDocs(
        collection(
          db,
          "comments",
          `${mangaInfo._id}`,
          isOnReadPage ? `${chapterId}` : "all"
        )
      );
      return;
    }

    if (isOnReadPage) {
      let commentsForCurrChapter: DocumentData[] = [];

      const queryCommentsForChapter = query(
        collection(db, "comments", `${mangaInfo._id}`, "all"),
        where("chapterNumber", "==", chapterNumber)
      );

      const querySnapshot = await getDocs(queryCommentsForChapter);

      querySnapshot.docs.forEach((doc) =>
        commentsForCurrChapter.push(doc.data())
      );

      await handleCommentsSortBy("date", commentsForCurrChapter);
      return;
    }

    const mangaCommentsMapped = mangaComments.docs.map(
      (doc: QueryDocumentSnapshot) => doc.data()
    );

    await handleCommentsSortBy("date", mangaCommentsMapped);

    setIsLoading(false);

    return mangaCommentsMapped;
  }

  return (
    <div id={styles.container}>
      <WriteCommentFormContainer
        isLoadingHook={isLoading}
        loadComments={getCommentsForManga}
        mediaInfo={{
          id: mangaInfo._id,
          title: mangaInfo.title,
          coverImage: mangaInfo.coverImage,
        }}
        setIsLoadingHook={setIsLoading}
        setIsUserModalOpenHook={() => dispatch(toggleShowLoginModalValue())}
      />

      <div id={styles.all_comments_container}>
        {commentsList.length > 0 && (
          <React.Fragment>
            <div id={styles.comments_heading}>
              {commentsList.length > 1 && (
                <div id={styles.custom_select}>
                  <SvgFilter width={16} height={16} alt="Filter" />
                  <select
                    onChange={(e) =>
                      handleCommentsSortBy(
                        e.target.value as "date" | "likes" | "dislikes"
                      )
                    }
                    title="Sort comments"
                  >
                    <option selected value="date">
                      Most Recent
                    </option>
                    <option value="likes">Most Likes</option>
                    <option value="dislikes">Most Dislikes</option>
                  </select>
                </div>
              )}

              <p>
                {commentsList.length} comment
                {commentsList.length > 1 ? "s" : ""}
              </p>
            </div>

            <ul>
              {!isLoading &&
                commentsList
                  .slice(0, commentsSliceRange)
                  .map((comment) => (
                    <CommentContainer
                      key={comment.createdAt}
                      comment={comment as UserComment}
                      mediaId={Number(mangaInfo._id)}
                      isLoadingHook={isLoading}
                      loadComments={getCommentsForManga}
                      setIsLoadingHook={setIsLoading}
                      setIsUserModalOpenHook={() =>
                        dispatch(toggleShowLoginModalValue())
                      }
                      mediaInfo={{
                        id: mangaInfo._id,
                        title: mangaInfo.title,
                        coverImage: mangaInfo.coverImage,
                      }}
                    />
                  ))}
            </ul>

            {commentsList.length > commentsSliceRange && (
              <button onClick={() => handleCommentsSliceRange()}>
                SEE MORE COMMENTS
              </button>
            )}
          </React.Fragment>
        )}

        {isLoading && (
          <div>
            <SvgLoading width={120} height={120} alt="Loading" />
          </div>
        )}

        {commentsList.length === 0 && !isLoading && (
          <div id={styles.no_comments_container}>
            <p>No Comments Yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
