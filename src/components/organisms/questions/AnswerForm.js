import React, { useState, useContext } from "react";
import { Redirect } from "react-router-dom";
import MarkdownView from "react-showdown";
import styled from "styled-components";
import QuestionService from "../../../services/QuestionService";
import Error from "../../atoms/Error";
import { AuthProvider, IfFirebaseAuthed, IfFirebaseUnAuthed } from "../../../context/FirebaseAuthContext";

import UserContext from "../../../context/UserContext";
import { Link } from "react-router-dom/cjs/react-router-dom.min";

const Title = styled.h1`
	font-size: 30px;
	text-align: center;
	margin: 20px 0 20px 0;
`;

const Form = styled.form`
	width: 800px;
	margin: 0 auto;

	@media (max-width: 850px) {
		width: 90%;
	}
`;

const Editor = styled.section`
	border: 1px solid var(--primary-border);
	border-bottom: 5px solid var(--primary-border);
	width: 100%;
	margin: 0 auto;
	position: relative;
	overflow: hidden;
	border-radius: 5px;
	margin-bottom: 20px;
`;
const Field = styled.textarea`
	resize: none;
	width: 100%;
	border: none;
	padding: 5px 10px;
	font-size: 18px;
	direction: ltr;

	&:focus {
		outline: none;
	}
`;

const Label = styled.label`
	font-size: 15px;
`;

const Button = styled.button`
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
	border: none;
`;

const Notice = styled.p`
	font-size: 18px;
	text-align: center;
	margin-bottom: 20px;
`;

const NoticeLink = styled(Link)`
	color: #41abe8;
	text-decoration: none;

	&:hover {
		text-decoration: underline;
	}
`;

const AnswerForm = ({ id }) => {

	const questionService = new QuestionService();
	const userContext = useContext(UserContext);

	const [ error, setError ] = useState("");
	const [ pending, setPending ] = useState(false);
	const [ success, setSuccess ] = useState(false);
	const [ input, setInput ] = useState("");

	const handleInput = (e) => {
		setInput(e.target.value);
	};

	const Submit = async (e) => {
		e.preventDefault();
	
		setPending(false);
		setError("");

		
		if(input.length === 0) {
			
			setError("question/empty-fields");
			setPending(false);
				
		}
		else {

			try {
				
				await questionService.addAnswer(id, userContext, input);
				setSuccess(true);
			}
			catch(error) {
				setError("question/unknown-error");
			}
		}

	};

	return (
		<AuthProvider>
			<IfFirebaseAuthed>
				<Form onSubmit={e => Submit(e)}>
					{ success && <Redirect to="/questions" /> }
					<Title>الديك إجابه؟</Title>
					
					{ error === "question/empty-fields" && <Error>الرجاء إملاء جميع الخانات</Error> }
					{ error === "question/unknown-error" && <Error>حدث خطأ</Error>  }
					
					<Label>الاجابة:</Label>
					<Editor>
						<Field
							name="content"
							rows="10"
							disabled={pending}
							onChange={e => handleInput(e)}
						></Field>
					</Editor>
					<Label>عرض مسبق:</Label>
					<hr></hr>
					<br />
					<MarkdownView markdown={input} className="markdown-view"/>
					<Button
						disabled={pending}
						type="submit"
					>نشر الأجابة</Button>
				</Form>
			</IfFirebaseAuthed>
			<IfFirebaseUnAuthed>
				<Notice>الديك إجابة؟ <NoticeLink to="/login">تسجيل الدخول</NoticeLink>.</Notice>
			</IfFirebaseUnAuthed>
		</AuthProvider>
	);
};

export default AnswerForm;