const express = require('express');
const { ensureAuthenticated } = require('../config/auth');
const mongoose = require('mongoose');
const router = express.Router();

const User = require('../models/User');
const Course = require('../models/Course');




//home page route


router.get("/", (req , res) => {



  if(req.user)
  {
    User.find({username:req.user.username} , (err , user) => {

      if(err) throw err;
      if(user)
      {


        res.render('home',{
          status:"logged",
          username:req.user.username,
          weeds:req.user.weeds,
          layout:"main.handlebars"
        });
      }
    });
  }
  else
  {
    res.render('home' , {
      status:"not_logged",
      layout:"main.handlebars"
    });
  }
});




//sharing page
router.get('/share/choose_subject' , ensureAuthenticated ,(req, res) => {
  Course.find().distinct('subject', (err , subjects) =>{
    if(err) throw err;

    res.render('choose_subject', {
      subjects,
      layout:"data_entry.handlebars"
    });


  });


});


//get the subject then redirect to the sharing page
router.get('/share/choose_subject/:subject' , ensureAuthenticated ,(req , res) => {
  const subject = req.params.subject;

  res.render('share',{
    subject:clean(subject),
    layout:"data_entry.handlebars"
  });
});


//get the course page
function clean(string){
  if(string)
  {
    string = string.toLowerCase();
    string = string.trim();
    return string;
  }
  else
  {
    return null;
  }
}

router.get("/courses/:subject",(req , res) => {


  const search_value = req.query.search ;
  const subject = req.params.subject;

  let sub2 = clean(subject);

  const n_per_page = 10;
  let page_number = req.query.page_number || 1;
  page_number = (page_number <= 0) ? 1 : page_number;

  let bool;
  let query;


  //check if the user is the admin



  //if the subject does not exist
  Course.find({} , {subject:1 , _id :0} , (err , result) => {
    if(err) throw err;
    let array = [];
    result.forEach((item) => {
      item = clean(item.subject);
      array.push(item);
    });
    req.session.subjects = array; //store the array of subjects
  });

  if(search_value)
  {
     query = {subject:sub2 , title : {$regex : ".*"+search_value+".*" , $options:"i"}};
     bool = "search";
  }
  else
  {
    query = {subject:sub2};
  }

  Course.find(query , (err , results) => {
    if(err) throw err;
    req.session.n_courses = results.length;
  });

  //find all courses in database

  Course.find(query).lean().limit(n_per_page).skip(n_per_page*page_number - n_per_page).sort({score:-1})  //need to srt it by subject
    .then((results) => {
      //results are the courses in the same subject


      if(req.user)
      {

         let admin = req.user.username == "pillow2002" ? "admin" : "anything";
         if(admin == "admin")
         {
           results.forEach((item) => {
             item["admin"] = "admin";
           });
         }
         else
         {
           results.forEach((item) => {
             item["admin"] = "anything";
           });
         }


         for(var i = 0 ; i < results.length ; i++) //for every course in subject X
         {
          if(results[i].savers.includes(req.user.username))
          {
            results[i].saved = "yes";
          }
          let voters = results[i].voters; //select the voters of subject 1
          for(var j = 0; j < voters.length ; j++) // loop through the voters
           {
             if(voters[j].username === req.user.username) //if the voter
             {
               results[i].voters = voters[j];
               break;
             }
           }
         }

         let page_numberl = parseInt(page_number) - 1;
         let page_numberr = parseInt(page_number) + 1;

         if(!req.session.subjects.includes(sub2))
         {
           res.render('error',{
             layout:"data_entry.handlebars"
           });
         }


         else if(results.length == req.session.n_courses) // only one page exists
         {
           if(results.length == 0)
           {

             res.render("course_logged_in",{
               username:req.user.username,
               weeds:req.user.weeds,
               subject:clean(subject),
               results,
               page_number,
               page_numberl,
               page_numberr,
               admin:admin,
               // bool,
               search_value:search_value,
               display:"block",
               arrow_status:"all",
               layout:"data_entry.handlebars"
             });
           }
           else
           {

             res.render("course_logged_in",{
               username:req.user.username,
               weeds:req.user.weeds,
               subject:clean(subject),
               results,
               page_number,
               page_numberl,
               page_numberr,
               bool,

               display:"none",
               search_value:search_value,
               arrow_status:"all",
               layout:"data_entry.handlebars"
             });
           }

         }

         else if(page_number == Math.ceil(req.session.n_courses/n_per_page))
         {

           res.render("course_logged_in",{
             username:req.user.username,
             weeds:req.user.weeds,
             subject:clean(subject),
             results,
             page_number,
             page_numberl,
             page_numberr,
             bool,

             display:"none",
             search_value:search_value,
             arrow_status:"end",
             layout:"data_entry.handlebars"
           });
         }
         else if(page_number == 1)
         {
           res.render("course_logged_in",{
             username:req.user.username,
             weeds:req.user.weeds,
             subject:clean(subject),
             results,
             page_number,
             page_numberl,
             page_numberr,
             bool,

             display:"none",
             search_value:search_value,
             arrow_status:"start",
             layout:"data_entry.handlebars"
           });
         }
         else
         {
           res.render("course_logged_in",{
             username:req.user.username,
             weeds:req.user.weeds,
             subject:clean(subject),
             results,
             page_number,
             page_numberl,
             bool,
             display:"none",
             page_numberr,
             search_value:search_value,
             layout:"data_entry.handlebars"
           });
         }
        }

      else
      {

        let page_numberl = parseInt(page_number) - 1;
        let page_numberr = parseInt(page_number) + 1;

        if(!req.session.subjects.includes(sub2))
        {
          res.render('error',{
            layout:"data_entry.handlebars"
          });
        }

        else if(results.length == req.session.n_courses)
        {
          if(results.length == 0)
          {
            res.render("course",{
              subject:clean(subject),
              results,
              page_number,
              page_numberl,
              // bool,
              display:"block",
              page_numberr,
              search_value:search_value,
              arrow_status:"all",
              layout:"data_entry.handlebars"
            });
          }
          else
          {
            res.render("course",{
              subject:clean(subject),
              results,
              page_number,
              page_numberl,
              bool,
              page_numberr,
              display:"none",
              search_value:search_value,
              arrow_status:"all",
              layout:"data_entry.handlebars"
            });
          }
        }

        else if(page_number == Math.ceil(req.session.n_courses/n_per_page))
        {
          res.render("course",{
            subject:clean(subject),
            results,
            page_number,
            page_numberl,
            page_numberr,
            bool,
            display:"none",
            search_value:search_value,
            arrow_status:"end",
            layout:"data_entry.handlebars"
          });
        }
        else if(page_number == 1)
        {
          res.render("course",{
            subject:clean(subject),
            results,
            page_number,
            page_numberl,
            page_numberr,
            bool,
            display:"none",
            search_value:search_value,
            arrow_status:"start",
            layout:"data_entry.handlebars"
          });
        }
        else
        {
          res.render("course",{
            subject:clean(subject),
            results,
            page_number,
            page_numberl,
            page_numberr,
            bool,
            display:"none",
            search_value:search_value,
            layout:"data_entry.handlebars"
          });
        }

      }

    })
    .catch((err) => { console.log(err); })

});


//browse subjects here
router.get('/subjects', (req , res) => {
  Course.find().distinct('subject', (err , subjects) =>{
    if(err) throw err;

    res.render('subjects', {
      subjects,
      layout:"data_entry.handlebars"
    });

  });

});

//add the ressource to the database
function calculateScore(course){
  course.score = 0;
  if(course.voters.length == 0)
  {
    return 0;
  }
  else
  {
    for(var i = 0; i < course.voters.length ; i++)
    {
      course.score += course.voters[i].vote;
    }
    return course.score;
  }
}

router.post('/share/choose_subject/:subject' , (req,res) => {

  const sub = req.params.subject;
  req.body["subject"] = sub;

  const {title , link , type , source , subject } = req.body;

  let share_errors = [];

  if(!title || !link || !type || !source)
  {
    share_errors.push({msg:"Please fill in all fields"});
  }


  //if some fields are left empty

  if(share_errors.length > 0)
  {
    res.render('share',{
      subject,
      share_errors,
      layout:"data_entry.handlebars"
    });
  }

  else
  {
    //add the course to the database

    Course.findOne({title:title}, (err , course) => {
      if(err) throw err ;
      if(course)
      {
        share_errors.push({msg:"Course already Submitted."});
        res.render('share',{
          subject,
          share_errors ,
          layout:"data_entry.handlebars"
        });
      }

      else
      {

        course = new Course({
          title,
          link,
          type,
          source,
          subject: clean(subject),
          voters:[{
            username:req.user.username,
            vote:1,
            color:"green"
          }],
          user: req.user.username,
          weeds:req.user.weeds

        });

        course.score = calculateScore(course);
        course.save();
        req.flash('success_msg',"Thank you for sharing Ressources with the AlphaCourse community!");
        //we should redirect to somewhere else
        res.redirect('/courses/'+subject);
      }
    });
  }
});

//add subject page
router.get('/add_subject' ,ensureAuthenticated ,(req , res) => {

  res.render('add_subject' , {
    layout:"data_entry.handlebars"
  });

});


router.post('/add_subject' , (req , res) => {
  const {subject , title , link , type , source} = req.body;

  let errors = [];
  //check if all the fields are full
  if(!subject || !title || !link || !type || !source)
  {
    errors.push({msg:"Please fill in all fields"});
  }


  Course.find().distinct("subject" , (err , subjects) => {
    if(err) throw err;
    const lowerCaseSubject = subject.toLowerCase();


    let new_subjects1 = subjects.map(item => item.toLowerCase());

    let new_subjects = new_subjects1.map(item => item.trim());



    let subjectExists = false;
    for(var i = 0 ; i < new_subjects.length; i ++)
    {
      if(new_subjects[i] === lowerCaseSubject.trim())
      {
        subjectExists = true;
      }
    }

    if(subjectExists)
    {
      errors.push({msg:"Subject already exists"});
      res.render("add_subject" , {
        errors,
        layout:"data_entry.handlebars"
      });
    }
    else
    {
      if(errors.length > 0)
      {
        res.render('add_subject', {
          errors,
          layout:"data_entry.handlebars"
        });
      }
      else
      {
        const course = new Course({
          title,
          link,
          type,
          source,
          subject:clean(subject),
          voters:[{
            username:req.user.username,
            vote:1,
            color:"green"
          }],
          user:req.user.username,
          weeds:req.user.weeds
        });
        course.score = calculateScore(course);
        course.save();
        req.flash('success_msg',"Subject added successfully");
        res.redirect('/courses/'+clean(subject));
      }

      }

  });



});

//handle the neutra vote
//function to compare 2 jsons
function compare(json1 , json2){
  let keys1 = Object.keys(json1);
  let keys2 = Object.keys(json2);
  let flag = true;

  for(key in keys1)
  {


    if(json1[keys1[key]] !== json2[keys2[key]])
    {
      flag = false;
    }
  }
  return flag;
}


function removeVote(req ,id , course , vote_nb , vote_color){

  for(var i = 0  ;i < course.voters.length ; i++) //this for loop removes the upvote
  {

    if(compare(course.voters[i] , {username:req.user.username , vote : vote_nb , color:vote_color}))
    {

      course.voters.splice(i , 1);
      course.score = calculateScore(course);
      Course.findOneAndUpdate({_id:id}, {
        $set:{
          voters:course.voters,
          score:course.score
        }
      },

      function(err , course){
        if(err) throw err;
      }
    );
      break;
    }
  }
}


router.post('/neutral_vote',ensureAuthenticated,(req , res) => {

  //in the neutral vote I should delete the user from the voters list and recalculat the score
  const id = req.body.clss;



  Course.findOne({_id:id}, (err , course) => {
    if(err) throw err;
    if(course)
    {

      removeVote(req , id , course , 1 , "green"); //removing the upvote
      removeVote(req , id , course , -1 , "red"); //removing the upvote

      res.json({score :course.score});

    }
  });
});

//handle the pure upvote
router.post('/up_vote',ensureAuthenticated ,(req , res) => {
  const id = req.body.clss;
  Course.findOne({_id:id} , (err , course) => {
    if(err) throw err;

    if(course)
    {

      removeVote(req , id , course , -1 , "red"); //I should also delete the downvoting element

      course.voters.push({username:req.user.username , vote:1 ,color:"green"});
      course.score = calculateScore(course);


      Course.findOneAndUpdate({_id:id}, {
        $set:{
          voters:course.voters,
          score:course.score
        }
      },
      function(err , course){
        if(err) throw err;
      }
      );

      res.json({score :course.score});

    }
  });
});


//handles the pure downvote
router.post('/down_vote', ensureAuthenticated , (req , res) => {

  const id = req.body.clss;
  Course.findOne({_id:id} , (err , course) => {
    if(err) throw err;

    if(course)
    {

      removeVote(req , id , course , 1 , "green"); //remove the upvote

      course.voters.push({username:req.user.username , vote: -1 ,color:"red"});
      course.score = calculateScore(course);

      Course.findOneAndUpdate({_id:id}, {
        $set:{
          voters:course.voters,
          score:course.score
        }
      },
      function(err , course){
        if(err) throw err;
      }
      );

      res.json({score :course.score});

    }
  });

});

//logout request
router.get("/logout" , (req , res) => {
  req.logout();
  res.redirect("/");
});

//handling the change in weeds

router.post('/weeds', (req , res) => {

  User.find({} , (err ,users) => {
    if(err) throw err;
    if(users)
    {
      users.forEach(user => {
        let score = 0;
        Course.find({user:user.username} , (err , courses) => {
          courses.forEach(course => {
            score += course.score;
          });
          Course.updateMany({user:user.username} , { //updates the first course only
            $set:{
              weeds:score
            }
          },
          function(err , course){
            if(err) throw err;
          }
        );
        User.findOneAndUpdate({username:user.username} , {
          $set:{
            weeds:score
          }
        },
        function(err , smthing){
          if(err) throw err;
        }
      );
        });
      });
    }
  });
  res.sendStatus(200);
});

router.post('/save' , (req ,res) => {

  const id = req.body.id;

  User.findOne({username:req.user.username} , (err , user) => {   //add the id of the saved course to the array of saved
    if(err) throw err;

    if(user)
    {
      let array = user.saved;
      array.push(id);
      User.findOneAndUpdate({username:req.user.username} , {
        $set:{
          saved:array
        }
      },
      function(err , success){
        if(err) throw err;
      }

    );
    }
  });

  Course.findOne({_id:id} , (err , course) => {
    if(err) throw err;

    if(course)
    {
      let array = course.savers;
      array.push(req.user.username);
      Course.findOneAndUpdate({_id:id} , {
        $set:{
          savers:array
        }
      },
      function(err , result){
        if(err) throw err;
      }
    );
    }
  });


  res.sendStatus(200);
});

router.post('/unsave' , (req , res) => {

  const id = req.body.id;

  User.findOne({username:req.user.username} , (err , user) => {
    if(err) throw err;

    if(user)
    {
      let array = user.saved;
      let index = array.indexOf(id);
      array.splice(index , 1);

      User.findOneAndUpdate({username:req.user.username} , {

        $set:{
          saved:array
        }
      },
      function(err ,success){
        if(err) throw err;
      }
    );
    }
  });

  Course.findOne({_id:id} , (err , course) => {
    if(err) throw err;

    if(course)
    {
      let array = course.savers;
      let index = array.indexOf(req.user.username);
      array.splice(index ,1);

      Course.findOneAndUpdate({_id : id }, {
        $set:{
          savers:array
        }
      },
      function(err , result){
        if(err) throw err;
      }
    );
    }
  });

  res.sendStatus(200);


});

router.get('/profile' , (req , res) => {

  User.findOne({username:req.user.username} , (err ,user) => {
    if(err) throw err;

    if(user)
    {
      let array = user.saved;

      Course.find({_id: {$in:array}}).lean()
        .then((results) => {

          res.render('profile', {
            username:req.user.username,
            weeds:req.user.weeds,
            results,
            layout:"data_entry.handlebars"
          });
        })
        .catch(error => console.log(error))

    }
  });
});

router.post('/admin_delete' ,ensureAuthenticated ,(req , res) => {
  const id = req.body.course_id;
  Course.deleteOne({_id:id} , (err , result) => {if(err) throw err;});
  res.sendStatus(200);
});



module.exports = router;
