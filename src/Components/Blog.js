import { useEffect, useReducer, useRef } from "react";
import { useState } from "react";
import { db } from "../Firebaseinit";
import { collection, addDoc } from "firebase/firestore"; 

//import {  getDocs } from "firebase/firestore";
import {  onSnapshot } from "firebase/firestore";

import { doc, deleteDoc } from "firebase/firestore";



function blogsReducer(state,action){
   switch(action.type){
    case "ADD":
        return [action.blog,...state]
    case "REMOVE":
        return state.filter((blog,index) => index!==action.index) 
    case "SET":
            return action.blogs;
     default:
         return []   
   }
}
//Blogging App using Hooks
export default function Blog(){
    // const [Title,setTitle]=useState("");
    // const [Content,setContent]=useState("");

    const [formData,setFormData]=useState({Title:"",Content:""})
   // const [blogs,setBlogs]=useState([]);      we'll be changing it to useReducer
   const [blogs,dispatch]=useReducer(blogsReducer,[]);
    const  titleRef=useRef(null)
 
    //soo that intitally focus should be on title on intitally rendering
    useEffect(() => {
        titleRef.current.focus();
    },[])
    
    //if blog is present than change title of webpage to recently added blog title
    useEffect(() => {
        if (blogs.length && blogs[0].Title) {
            document.title = blogs[0].Title;
        }else{
            document.title = "Give title to your blog"
        }
    }, [blogs]);

    useEffect(() =>{

        // async function fetchData(){
        //     const querySnapshot = await getDocs(collection(db, "blogs"));

        //      const blogs=querySnapshot.docs.map((doc) => {
        //         return{
        //             id:doc.id,
        //             ...doc.data()
        //         }
        //      })
        //      console.log(blogs);
        //      dispatch({ type: "SET", blogs });
         
        // }
        // fetchData();

       
        //to create listener to 
        const unsub =  onSnapshot(collection(db,"blogs"), (snapShot) => {
            const blogs = snapShot.docs.map((doc) => {
                    return{
                        id: doc.id,
                        ...doc.data()
                    }
                })
                console.log(blogs);
                dispatch({ type: "SET", blogs });
        })
    },[])
    //Passing the synthetic event as argument to stop refreshing the page on submit
    async function handleSubmit(e){
        e.preventDefault();
        
        //no nneed to setblogs manually here we had added listener to it
       // setBlogs([{Title:formData.Title,Content:formData.Content},...blogs]);  will change these to dispatch when using useReducer
       dispatch({type:"ADD",blog:{Title:formData.Title,Content:formData.Content}})

        console.log(blogs);

         // Clear the input fields
         setFormData({Title:"",Content:""});

         // Add a new document with a generated id.
         //coz i made an collection with blogs as name so 
        const docRef = await addDoc(collection(db, "blogs"), {
            Title: formData.Title,
            Content: formData.Content,
            createdOn:new Date()
        });
        console.log("Document written with ID: ", docRef.id);

         titleRef.current.focus();

    }

    async function removeBlog(id){
        //setBlogs(blogs.filter((blog,index) => i!==index)); //will show all other blogs after deleting that particular index blog
        
        await deleteDoc(doc(db, "blogs", id));
       // dispatch({type:"REMOVE",index:id})
    }

  
    return(
        <>
        {/* Heading of the page */}
        <h1>Write a Blog!</h1>

        {/* Division created to provide styling of section to the form */}
        <div className="section">

        {/* Form for to write the blog */}
            <form onSubmit={handleSubmit}>

                {/* Row component to create a row for first input field */}
                <Row label="Title">
                        <input className="input"
                                placeholder="Enter the Title of the Blog here.."
                                value={formData.Title}
                                onChange={(e) =>setFormData({Title:e.target.value ,Content:formData.Content })}
                                 ref={titleRef}/>
                </Row >

                {/* Row component to create a row for Text area field */}
                <Row label="Content">
                        <textarea className="input content"
                                placeholder="Content of the Blog goes here.."
                                value={formData.Content}
                                required
                                onChange={(e) =>setFormData({Title:formData.Title,Content:e.target.value})}/>
                </Row >

                {/* Button to submit the blog */}            
                <button className = "btn">ADD</button>
            </form>
                     
        </div>

        <hr/>

        {/* Section where submitted blogs will be displayed */}
        <h2> Blogs </h2>
         {blogs.map((blog,i) => (
            <div className="blog" key={i}>
            <h3>{blog.Title}</h3>
            <p>{blog.Content}</p>

            <div className="blog-btn">
                 <button className="btn remove" onClick={() => {removeBlog(blog.id)}}>
                    Delete
                 </button>
            </div>
            </div>
        ))}

        
        </>
        )
    }

//Row component to introduce a new row section in the form
function Row(props){
    const{label} = props;
    return(
        <>
        <label>{label}<br/></label>
        {props.children}
        <hr />
        </>
    )
}
