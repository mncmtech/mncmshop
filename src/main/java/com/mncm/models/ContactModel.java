package com.mncm.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;
import java.util.List;

/**
 * Created by sonudhakar on 13/01/18.
 */
@Data
public class ContactModel  implements Serializable
{
    @JsonProperty("id")
    private String id;

    @JsonProperty("accountId")
    private String accountId;

    @JsonProperty("login")
    private String login;

    @JsonProperty("password")
    private String password;

    @JsonProperty("firstName")
    private String firstName;

    @JsonProperty("lastName")
    private String lastName;

    @JsonProperty("linkedContactMethods")
    private List<String> linkedContactMethods;

    @JsonProperty("photoId")
    private String photoId;
}
