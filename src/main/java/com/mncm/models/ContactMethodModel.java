package com.mncm.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;

/**
 * Created by sonudhakar on 29/07/17.
 */
@Data
public class ContactMethodModel implements Serializable {

    @JsonProperty("id")
    private String id;

    @JsonProperty("key")
    private String key;

    @JsonProperty("value")
    private String value;

    @JsonProperty("type")
    private ContactMethodType type;

    @JsonProperty("primary")
    private Boolean primary;

}
