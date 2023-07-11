const User=require('../../models/userModel.js');
const { GraphQLError } = require('graphql');

module.exports={
    Query:{
        getUsers:async()=>{
            try{
                const users=await User.find({});
                return users;
            }
            catch(err){
                throw new Error(err);
            }
        }
    },

    Mutation:{
        login:async(_,{email,password})=>{
            const user=await User.findOne({email:email}).select('+password');
    
            if(!user){
            throw new GraphQLError('no user with such email',{
            extentions: {
            code: 'BAD_USER_INPUT',
            }
            })
            }
            console.log("ok");
            const isequal=await user.comparePassword(password);
    console.log(`the passwords are equal : ${isequal}`);

    if(!isequal){
    throw new GraphQLError('password not equal',{
    extentions: {
    code: 'BAD_USER_INPUT',
    }
    })
    }
    console.log("ok2");
    
    const token=user.createJWT();
    user.password = undefined;
  //  return{...user._doc,id:user._id,token};
  return {id:user._id,name:user.name,email:user.email,token};


        },
        

        register:async(_,{registerInput: {name,email,password}})=>{
 console.log(`the data received from the frontend for register is name=${name} email is ${email} password=${password}`)
            try{
                const existinguser=await User.findOne({email:email})
                if(existinguser){
                throw new GraphQLError('email already exists',{
                extentions: {
                code: 'BAD_USER_INPUT',
                }
                })
                }
                
               // const hashpassword=await bcrypt.hash(args.password,12)
                
                const user=await User.create({
                email:email,
                password:password,
                name:name,
                createdAt:new Date().toISOString()
                });

                
                //const result=await User.save()
                const token=user.createJWT();
                
                user.password = undefined;
                return {id:user._id,name:user.name,email:user.email,password:user.password,createdAt:user.createdAt,token};
                
                }
                catch(error){
                    console.log('Error creating user:', error);
                throw new GraphQLError('creating user failed',{
                extentions: {
                code: 'BAD_USER_INPUT',
                }
                })
                
                }
                


        }
    }
}