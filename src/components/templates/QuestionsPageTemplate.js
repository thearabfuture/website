import React from "react";
import styled, { keyframes } from "styled-components";

import PageTemplate from "./PageTemplate";
import Question from "../molecules/Question";

import LoadingPicture from "../../static/images/loading.png";
import { Link as BaseLink } from "react-router-dom";

const Rotate = keyframes`
	from {
		transform: rotate(0);
	}
	to {
		transform: rotate(360deg);
	}
`;

const Loading = styled.section`
	font-size: 100px;
	text-align: center;
	margin: 80px 0;
`;

const Image = styled.img`
	width: 100px;
	animation: ${Rotate} 1s infinite;
	animation-timing-function: linear;
	opacity: 0.5;
`;

const Warning = styled.p`
	text-align: center;
	font-size: 17px;
	margin: 80px 0;
`;

const Link = styled(BaseLink)`
	text-decoration: none;
	color: white;
	width: 150px;
	background: var(--main-color);
	margin: 30px auto;
	display: block;
	text-align: center;
	font-size: 17px;
	padding: 10px 0;
	border-radius: 5px;
	cursor: pointer;
`;

const QuestionsPageTemplate = ({ error, pending, questions }) => (
	<PageTemplate>
		{ pending && <Loading><Image src={LoadingPicture} /></Loading> }
		{ !pending && <Link to="/questions/new">إطرح سؤالاً</Link>}
		{ questions.length === 0 && !pending && <Warning>لا توجد اسئلة حتى الآن.</Warning> }
		{ questions && questions.map(question => <Question key={question.id} question={question} />) }
	</PageTemplate>
)

export default QuestionsPageTemplate;