package umm3601.contextpack;

import java.util.ArrayList;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;


@JsonIgnoreProperties(ignoreUnknown=true)

public class Pos {
  String word;
  ArrayList<String> forms;

  public String getWord(){
    return this.word;
  }

  public ArrayList<String>getForms(){
    return this.forms;
  }

}

