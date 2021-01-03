import 'dart:io';

import 'package:flutter/material.dart';
import 'package:http/http.dart';
import 'package:universal_io/io.dart';
//import 'dart:async';
import 'dart:convert';

void main() => runApp(MyApp());

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Node server demo',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: Scaffold(
        appBar: AppBar(title: Text('Flutter Client')),
        body: BodyWidget(),
      ),
    );
  }
}

class BodyWidget extends StatefulWidget {
  @override
  BodyWidgetState createState() {
    return new BodyWidgetState();
  }
}

class BodyWidgetState extends State<BodyWidget> {
  String serverResponse = 'Server response';
  final emailController = TextEditingController();
  final passwordController = TextEditingController();
  final petNameController = TextEditingController();
  String _jwt = '';

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(32.0),
      child: Align(
        alignment: Alignment.topCenter,
        child: SizedBox(
          width: 200,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: <Widget>[
              Text('email'),
              TextFormField(controller: emailController),
              Text('password'),
              TextFormField(controller: passwordController),
              Text('pet name'),
              TextFormField(controller: petNameController),
              RaisedButton(
                  child: Text('Hello?'),
                  onPressed: () {
                    getHello();
                  }),
              RaisedButton(
                  child: Text('Register'),
                  onPressed: () {
                    registerUser();
                  }),
              RaisedButton(
                  child: Text('Login'),
                  onPressed: () {
                    login();
                  }),
              RaisedButton(
                  child: Text('Find pet'),
                  onPressed: () {
                    findPet();
                  }),
              RaisedButton(
                  child: Text('Add pet'),
                  onPressed: () {
                    addPet();
                  }),
              Padding(
                padding: const EdgeInsets.all(8.0),
                child: Text(serverResponse),
              ),
            ],
          ),
        ),
      ),
    );
  }

  registerUser() async {
    Response response = await post(_localhost() + '/register',
        headers: <String, String>{
          'Content-Type': 'application/json; charset=UTF-8'
        },
        body: jsonEncode(<String, String>{
          'email': emailController.text,
          'password': passwordController.text,
        }));
    setState(() {
      var res = jsonDecode(response.body);
      serverResponse = res['msg'];
    });
  }

  login() async {
    Response response = await post(_localhost() + '/login',
        headers: <String, String>{
          'Content-Type': 'application/json; charset=UTF-8'
        },
        body: jsonEncode(<String, String>{
          'email': emailController.text,
          'password': passwordController.text,
        }));
    setState(() {
      var res = jsonDecode(response.body);
      serverResponse = res['msg'];
      var jwt = res['user']['token'];
      //if (jwt) {
      _jwt = jwt;
      //}
      //Redirect (pop)
    });
  }

  getHello() async {
    Response response = await get(_localhost());
    setState(() {
      serverResponse = response.body;
    });
  }

  findPet() async {
    Response response = await post(_localhost() + '/findpet',
        headers: <String, String>{
          'Content-Type': 'application/json; charset=UTF-8'
        },
        body: jsonEncode(<String, String>{
          'name': petNameController.text,
        }));
    setState(() {
      var res = jsonDecode(response.body);
      if (res['success'] == true) {
        List<String> pets = res['msg'].cast<String>();
        serverResponse = pets.reduce((a, b) => a + '\n' + b);
      } else {
        serverResponse = res['msg'];
      }
    });
  }

  addPet() async {
    Response response = await post(_localhost() + '/addpet',
        headers: <String, String>{
          'Content-Type': 'application/json; charset=UTF-8',
          'Authorization': ('Token ' + _jwt)
        },
        body: jsonEncode(<String, String>{
          'name': petNameController.text,
        }));
    setState(() {
      var res = jsonDecode(response.body);
      serverResponse = res['msg'];
    });
  }

  String _localhost() {
    if (Platform.isAndroid)
      return 'http://10.0.2.2:3000';
    else // for iOS simulator
      return 'http://localhost:3000';
  }
}
