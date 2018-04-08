package com.mncm.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

/**
 * Created by User on 8/30/2017.
 */
@NoArgsConstructor
@Data
public class ErrorInfo  implements Serializable {

    @JsonProperty("code")
    private String code;

    @JsonProperty("message")
    private String message;

}
