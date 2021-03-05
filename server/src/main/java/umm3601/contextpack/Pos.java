package umm3601.contextpack;

import java.util.ArrayList;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
@JsonIgnoreProperties(ignoreUnknown=true)

public class Pos {
  ArrayList<Word> words;

}
