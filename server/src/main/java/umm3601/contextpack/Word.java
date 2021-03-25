package umm3601.contextpack;

import java.util.ArrayList;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown=true)

public class Word {
  public String word;
  public ArrayList<String> forms;

  public ArrayList<String> getForms(){
    return this.forms;
  }

  public void setForms(ArrayList<String> forms){
    this.forms = forms;
  }
  public void addForm(String form){
    this.forms.add(form);

  }
}

