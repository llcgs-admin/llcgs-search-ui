/************************************************************
 *  CONFIGURATION
 ************************************************************/

// 1. The Drive file ID of your uploaded index.json
const INDEX_JSON_FILE_ID = "1N7uUyqJmdc643yzqfgzX9fakPmKy7mGd";

// 2. The Drive folder ID containing ALL your PDF boxes
//    Example: a folder containing Box01, Box02, Box03, etc.
const PDF_ROOT_FOLDER_ID = "13n6TNij7aiDX2WYPPimS1C8IiT2LpWud";

// 3. Cache settings for the dynamic PDF map
const PDF_MAP_CACHE_KEY = "PDF_MAP_CACHE";
const PDF_MAP_CACHE_HOURS = 6;

/************************************************************
 *  PDF_MAP (paste your generated JSON here)
 ************************************************************/
const PDF_MAP = 
{
  "Box10/RG4831AUb010f006.pdf": "1XhXuSmDqj3mKKgighjaAzdyIQpvG6DQi",
  "Box10/RG4831AUb010f005.pdf": "1PtfW23pfgAWVxttt-gAXAdngZLbqNDfc",
  "Box10/RG4831AUb010f004.pdf": "1iR-7A33KMN4qIX6oudr_w-Ok6UpmZZn5",
  "Box10/RG4831AUb010f003.pdf": "1IA9HRCKALFdMqCC8cjCPNACUQ9pLjrho",
  "Box10/RG4831AUb010f002.pdf": "1Ese0mPp20WasH8Dd909Y5KBJ-O0O8LJL",
  "Box10/RG4831AUb010f001.pdf": "1m7Ju-8BGbrfZpH82dEWNd5wgeUT3TrWO",
  "Box10/RG4831AUb010f007.pdf": "1mGn_l36PaNr2KT4VW-c353GVkEPyyLHj",
  "Box07/RG4831AUb007f017.pdf": "1E9GvZcRNnE-rUTGhWTvKNDTE10avVzrz",
  "Box07/RG4831AUb007f016.pdf": "1_qtsszXRMymQWZJ7WDOdfe6pVa3HXue_",
  "Box07/RG4831AUb007f015.pdf": "1Ld_Wy-fn7JHlQbTY8V6rUn9ZZvGWNQEA",
  "Box07/RG4831AUb007f014.pdf": "1YB6z3fSJcYtFJtbsq4MuUeJZsJkSHSYG",
  "Box07/RG4831AUb007f013.pdf": "1hQrVjU6ZVcV6uAWNEzlahGh2DYrHY9C3",
  "Box07/RG4831AUb007f012.pdf": "1pOh5VFW-J_QkHLUFG_G4tdb9w1Jn7lPD",
  "Box07/RG4831AUb007f011.pdf": "1Ad8-Lkm3zXbpNqIdzavMI7fvrU6vWMKp",
  "Box07/RG4831AUb007f010.pdf": "12pX33wXjMOvdyDncfCfPh0Lo4nA7yLCz",
  "Box07/RG4831AUb007f009.pdf": "1PEvgGOSJPTrO_hBwmr1R5QUucTjh4hPa",
  "Box07/RG4831AUb007f008.pdf": "1gvB4CPrJtu7yiAHgwTCS8FYnaaDH6qZy",
  "Box07/RG4831AUb007f007.pdf": "1pOYhWIU14RsGpgyNNMNYWKPp8Ss_iUn-",
  "Box07/RG4831AUb007f006.pdf": "1xW9mEA1p8OZGeMTk0KsZDLhRcrIX7oRH",
  "Box07/RG4831AUb007f005.pdf": "1UH-L5gObgrLTyD0pnfV8hV2Oj_hxW7-h",
  "Box07/RG4831AUb007f004.pdf": "1dCuG-NmbpuU_iDEHccpeZrkZRpk0o3C5",
  "Box07/RG4831AUb007f003.pdf": "1vpYyXt4o-LcSlEFfnjC05Np10wzXmrUE",
  "Box07/RG4831AUb007f002.pdf": "1AJ1bmQl31e2S7aBhrct8kqBspYfo9n2I",
  "Box08/RG4831AUb008f011.pdf": "1Oxk24_mibL4tK5g2qDjjGsnHlik9BEzO",
  "Box08/RG4831AUb008f010.pdf": "1E3evEzAdYVgTUEVy7YlJsC9s8IiRKm9c",
  "Box08/RG4831AUb008f009.pdf": "17lmYD7WNrjf2Af5WASIY1BDujM5WwjJO",
  "Box08/RG4831AUb008f008.pdf": "1gAVQ0lebAnovKrNBWNDpWK4koPtu0fQ8",
  "Box08/RG4831AUb008f007.pdf": "1zdD9v1b1y5pBViSGZgideJheRV8lZ5H0",
  "Box08/RG4831AUb008f006.pdf": "1rmtmXNIfxFImfpo6rBXNZ_f_wRTMX8Y6",
  "Box08/RG4831AUb008f005.pdf": "15n5to7uAM_CiW6CKSvRfAibDdDorV1cd",
  "Box08/RG4831AUb008f004.pdf": "1MpdUZeO4VjTC08wc3TPYv31jtfTmA6xr",
  "Box08/RG4831AUb008f003.pdf": "152qX-8tJb1zjiK_uxOzPGqnPbT5srOKP",
  "Box08/RG4831AUb008f002.pdf": "1ZbjObBEHKOzID6JoT6mepYnDOuCcuXRi",
  "Box08/RG4831AUb008f001.pdf": "1vRD4Une2kIib5cjfF97xYRvlW_IX8PhO",
  "Box06/RG4831AUb006f010.pdf": "16pTpZbzOpFcgfCnOz9E-qEnVIpoKeP_t",
  "Box06/RG4831AUb006f009.pdf": "1ELAtOUV82vfz6XIUblJqxfpUmzG3CpL1",
  "Box06/RG4831AUb006f008.pdf": "1t-QwvlKIB_KYD-TVM2iQV9yscuE8LOPP",
  "Box06/RG4831AUb006f007.pdf": "1ppCmEEg40J4pHUiRPUfKgF5dPYBr8tyw",
  "Box06/RG4831AUb006f006.pdf": "19XFeli-vCAousVh0LHY2U73Zx7LHEROG",
  "Box06/RG4831AUb006f005.pdf": "1qntO0moFH0owsWgHy6xnsqrvjBMxJK5r",
  "Box06/RG4831AUb006f004.pdf": "1FFvcHHFw2hDsfGOuSAiuuJKMlCOCWl2w",
  "Box06/RG4831AUb006f003.pdf": "18PH-IMcaoNvzgy71WmGZ8-41Z08p7zlY",
  "Box06/RG4831AUb006f002.pdf": "164sXV5dlNApQfi7WdxoFhm4eZFQA8TLE",
  "Box06/RG4831AUb006f001.pdf": "1ButpXnKLwyDn25QUOgilup4Hn40IyslW",
  "Box09/RG4831AUb009f034.pdf": "1ELe-r_Hu4jFxc5RiG76hUtrW5wzi9Q2G",
  "Box09/RG4831AUb009f033.pdf": "1S_pcSnE2aENAzMslaIF3s59qNsjLH7Qf",
  "Box09/RG4831AUb009f032.pdf": "1pJNi75KdQGwBHAQ1WIxS0OurSQJqnQ_1",
  "Box09/RG4831AUb009f031.pdf": "1hbzZUpVGwSCt3ueewr2UTfmctjpGVtIo",
  "Box09/RG4831AUb009f018.pdf": "1Zvsmvj6VbYchfSBvZKTZjPJu61JgkAdG",
  "Box09/RG4831AUb009f017.pdf": "1xteFURTPQ1xSi7QIC8L-g6RXaWn_hPBo",
  "Box09/RG4831AUb009f016.pdf": "1_iQ73UV8knRfmp9mjw1xA4R6rD0MkgCU",
  "Box09/RG4831AUb009f015.pdf": "1IDP4l0fCgH0zfh2cbfYG9cCKiSBtwwx3",
  "Box09/RG4831AUb009f014.pdf": "1TuApY-2zKWIbYpyEUf3nMI1WwhGHOCNr",
  "Box09/RG4831AUb009f013.pdf": "14nxbS9XKEafl_GdZEWIKKFVC8D_U_F8J",
  "Box09/RG4831AUb009f012.pdf": "1lI4B95z43jcG1jkqaMTX0tHQOx4mJBg7",
  "Box09/RG4831AUb009f011.pdf": "1qorSU3eMFDvRRut2qbiLSGEzB_smMMgN",
  "Box09/RG4831AUb009f010.pdf": "1ChrKRfK0d_ZKi7k6FEJON616d_nxVVBw",
  "Box09/RG4831AUb009f009.pdf": "1bwyhxSEiwYTv9xuRND22Uw7W7W7nFTlO",
  "Box09/RG4831AUb009f008.pdf": "1pA_xDEon_u-B4GNBdacWERX5clj8wYDG",
  "Box09/RG4831AUb009f007.pdf": "1TX0GU8I0tgJmdNKFtYTz0KxDgjC6Z8Ne",
  "Box09/RG4831AUb009f006.pdf": "1I4EIfdt-xlk23L8yUmOnhLR8P8HqKKBM",
  "Box09/RG4831AUb009f005.pdf": "1huSlvcck7wJQnsrsH0nNUzcOvBz1fZS4",
  "Box09/RG4831AUb009f004.pdf": "1-jQPGJlMFgrccVSnsEhJ7BsJMKrEo0-I",
  "Box09/RG4831AUb009f003.pdf": "1pKvOp4W94Rez9edme2qdo4WXqN2Egs3v",
  "Box09/RG4831AUb009f002.pdf": "1q6wDeDKiQYogOeD8NgyB_ZC8Pi_5bU7i",
  "Box09/RG4831AUb009f001.pdf": "11QAvCj-e8rWo556Fjm1QvCVwk_TwIt3E",
  "Box03/RG4831AUb003f025.pdf": "1a4BH45b7vVDX759_ej2t4b_x67_lNn2i",
  "Box03/RG4831AUb003f024.pdf": "17ycapJ09wOvVeK9raZnABB-Alatd1-n1",
  "Box03/RG4831AUb003f023.pdf": "1khUxQE7puWYOFN-z54mdiFsBKA_rpeJL",
  "Box03/RG4831AUb003f022.pdf": "1m0VYpa7S7FWJO-sxp9BQoevBB_f7smTa",
  "Box03/RG4831AUb003f021.pdf": "1_Byt97ZPTAARpbEOsNU5VaTN7rKCO5Ok",
  "Box03/RG4831AUb003f020.pdf": "1wDSXt8E7aoxVe2wxYASvuCdcMUCuonlP",
  "Box03/RG4831AUb003f019.pdf": "1Z7rhWH0k7Bk3A3QdTnBHtYpR_T9AiDiS",
  "Box03/RG4831AUb003f018.pdf": "190Qgw6X3TiYzeM7k4teOWSkGM_bJdHC-",
  "Box03/RG4831AUb003f017.pdf": "1Bmm9JeDxHxQxXRVC8HaXqL_HOr8lDPj5",
  "Box03/RG4831AUb003f016.pdf": "1hxYF2NBahC9SgRKcDTrBjPdKE0Nfwie2",
  "Box03/RG4831AUb003f014.pdf": "18sdsP1JHLHpoOpGMX1saGHo4T7jP8nZx",
  "Box03/RG4831AUb003f013.pdf": "13cql_ViYUPYRmS6KhMz7waJP-MWcXzAq",
  "Box03/RG4831AUb003f012.pdf": "10wsKtJ2-kVhYpLd9cu1E0y8VvonctlG0",
  "Box03/RG4831AUb003f011.pdf": "1SxD-DdoPFvpuvAqxZSrdIUvrAj7NrmJl",
  "Box03/RG4831AUb003f010.pdf": "18Nvvn0oKvms-taAIqbyCTSixgzijK0xW",
  "Box03/RG4831AUb003f009.pdf": "1RKpBb1rM4efL8oYC8BB3u4WbQRvPow7G",
  "Box03/RG4831AUb003f008.pdf": "1SiX_uUSSXJmbdUkhzqvsk1NRdvBkQGAh",
  "Box03/RG4831AUb003f007.pdf": "1cTpXccLBYqk-2Ai0Vz9d2raI00YTDNj_",
  "Box03/RG4831AUb003f006.pdf": "10rU_R1jMBIb0wLgVthzrl7XLaRr6rs7b",
  "Box03/RG4831AUb003f005.pdf": "19uR1cbxL6_rjZkPD5Bza6mhDyakAUSom",
  "Box03/RG4831AUb003f004.pdf": "14faZKuftSVGBXz9b2yvO7oPOPsbA5gTH",
  "Box03/RG4831AUb003f003.pdf": "1guOMWUTXKUqlatoxXtMx_5psUVSfyNgF",
  "Box03/RG4831AUb003f002.pdf": "1syNwyvL1P5aqWm27TvZAswvVpQyKy6Jd",
  "Box03/RG4831AUb003f001.pdf": "1P78-bUT5v6tmwX8Yg46Gz9WFnnuxk4Kl",
  "Box03/RG4831AUb003f015.pdf": "1gpNplonw6SWYZUbvfHh7kKMQFWFDG038",
  "Box04/RG4831AUb004f027.pdf": "1pwBVtlVkoqHnHZcD0ahLKmNfmGTQMZnA",
  "Box04/RG4831AUb004f026.pdf": "1iFo_Afpg8vzZ3LEsHC_leEt6zg3IE-dj",
  "Box04/RG4831AUb004f023.pdf": "1IswhMNzu-xPCDvwN3CuFxEhT1HlV_1Yu",
  "Box04/RG4831AUb004f022.pdf": "1RfnmXnQqGML3gIwD50XNIwbTBhjb-0Uh",
  "Box04/RG4831AUb004f021.pdf": "1whkHRIl5w-Hab3zv4LyshDUzJTWT_0Ct",
  "Box04/RG4831AUb004f020.pdf": "1liJoxuV9ioIxLgvcXYocPVhNa0vdY3u3",
  "Box04/RG4831AUb004f019.pdf": "1SIb8AgQ2heaHZvxLj-tb2EcVmDe1cumS",
  "Box04/RG4831AUb004f018.pdf": "1599ZO5kRaOBLCtoyf9C8cY0tKSmLe4nF",
  "Box04/RG4831AUb004f017.pdf": "1XJ8zH74jGsQlvB7P7SKArRqvlJZIlx1m",
  "Box04/RG4831AUb004f016.pdf": "1OPaWWf0lRalpG6AQsdMKVfKWYJrtbESY",
  "Box04/RG4831AUb004f015.pdf": "11l20YIkP1ZesJ3oN-OBVzUctMMcxIvNs",
  "Box04/RG4831AUb004f014.pdf": "1UMjLvHxJozVe4dnH0X0jfKWw37JeXBVf",
  "Box04/RG4831AUb004f013.pdf": "1AZbCJiLHdbCu7PDwI95CTOggcovEsnt9",
  "Box04/RG4831AUb004f012.pdf": "1kPrkJx_9hEfrVY4nd4IEdNtCIHZssgDi",
  "Box04/RG4831AUb004f011.pdf": "1hE2rf2xtS4qZsJtprrv74pNPHdTajiPD",
  "Box04/RG4831AUb004f010.pdf": "1Bg20zYyh4aIMTxb4ouoRDjJ0FWdxaNnN",
  "Box04/RG4831AUb004f009.pdf": "1wE_xJnJIXGn_nxy-LsCrHBy8XRr5q5Q-",
  "Box04/RG4831AUb004f008.pdf": "1ljHbm2zZgrcWwVf8M4W3BXaneBQE5NPO",
  "Box04/RG4831AUb004f007.pdf": "1o2x2a4Vqy0a-1GGLIX6WlyT-2aXlSt62",
  "Box04/RG4831AUb004f006.pdf": "1uFWzhlEA3SdDOHYEHmx9lZLdTYKR4UA8",
  "Box04/RG4831AUb004f005.pdf": "1RNYkodHpEfCfnWcRiniV3KKLVR1KxFZ6",
  "Box04/RG4831AUb004f004.pdf": "13WtLYQ5yZW1MJwcs6jTmSrej-0XmjCij",
  "Box04/RG4831AUb004f003.pdf": "1uAAuHRohFF-lpYPX8I6-C_pG-_rh5csI",
  "Box04/RG4831AUb004f002.pdf": "1kaOZ93pdenmBzg8LyGMoLANNT2BGWzsc",
  "Box04/RG4831AUb004f025.pdf": "1gq9scqv2obHk_45FIzQSsPJBwaumxbJa",
  "Box04/RG4831AUb004f024.pdf": "1QSP6eU6IkKKTFsl-K5sNiL8acv1mCU6j",
  "Box05/RG4831AUb005f033.pdf": "1pgBfOxoJZVdZIA7cVbu5tcm9hEiVjqTt",
  "Box05/RG4831AUb005f032.pdf": "1DNnPWHIweD0b52TrkCBWP_II29eyVaDG",
  "Box05/RG4831AUb005f031.pdf": "1bDZxtRlICtgFQg49bcHM-MQKEVSj0XPX",
  "Box05/RG4831AUb005f030.pdf": "1UBHCU8_Zb1Mf-xDAjDJhQ6JtEGqPJNmU",
  "Box05/RG4831AUb005f029.pdf": "1ABDTAhxnbGF_uXxnF7C2gi3RjLPq5V45",
  "Box05/RG4831AUb005f028.pdf": "1arrDG0Iqr20qFqq66P_nxGB9KTFtK0tq",
  "Box05/RG4831AUb005f027.pdf": "1kgPOaXlKHFjaLXLUYL3arp3SuO8jLssf",
  "Box05/RG4831AUb005f026.pdf": "1ice_vSYBIuzNq4LN1ukBbfNk0Plxm-Ya",
  "Box05/RG4831AUb005f025.pdf": "1TmLHTT5BZOk74pjgei3iYI2CBIKWZ0BJ",
  "Box05/RG4831AUb005f024.pdf": "1sHuM-gjEv01bywTTmuXwDXc2olFQ4wBB",
  "Box05/RG4831AUb005f023.pdf": "1Y2X4N1Dy3_61G3QZKj5JKSZtLzRUlI-S",
  "Box05/RG4831AUb005f022.pdf": "1se3x9O8lNAVBV7zttx6ACUafInLnBwR-",
  "Box05/RG4831AUb005f021.pdf": "1-9FhqIU-hx52bnktG9tDpngtkV7j9kz4",
  "Box05/RG4831AUb005f020.pdf": "1QlvuLpr-bnxsLljYpE3szbIein-2ZOSz",
  "Box05/RG4831AUb005f019.pdf": "1z2u8jic0wJN4waKtl7-9Gd2YDEp3SmYl",
  "Box05/RG4831AUb005f018.pdf": "1mSLEz5Le_OYAzKMBEUput4VTPIhUR5Kg",
  "Box05/RG4831AUb005f017.pdf": "1TvGrC9j7skpkqPWrPoIDoT3VO_NYsT3T",
  "Box05/RG4831AUb005f015.pdf": "1USw_2S7PgGf-pMp7d6qZh3TivUg_fHsA",
  "Box05/RG4831AUb005f014.pdf": "1H-uHn0PKTWFpc5Z_qx2lfMexUlds7jrO",
  "Box05/RG4831AUb005f013.pdf": "1EGpXNoYOKrIm_uH_ClRDRtd5MGs1cMrl",
  "Box05/RG4831AUb005f012.pdf": "1Kejhe4KqiXb00JtRlzF24oFYu4Nj48wA",
  "Box05/RG4831AUb005f011.pdf": "1O6E4X261bi90Phm4JtH9ydoXFNk3qCjH",
  "Box05/RG4831AUb005f010.pdf": "1UVlpRNVpGHB6_-boW-vnFEhaYSDvrq8H",
  "Box05/RG4831AUb005f009.pdf": "1vPxN2yHJgRRDJpjqmjLtmPP7iTV-R1-X",
  "Box05/RG4831AUb005f008.pdf": "1meoq8vpDtEAY-lg6UqQU3wLyWEXcJovJ",
  "Box05/RG4831AUb005f007.pdf": "1orA2IxfNfoEf7yXYcwJkU3TGlbNJBbt4",
  "Box05/RG4831AUb005f006.pdf": "19sSHvoWL0XxxyTEAY31NHY5oAS55XIpW",
  "Box05/RG4831AUb005f005.pdf": "1I_wwmyFXw_jLRVu2jmOTEC21Yi9vTUpe",
  "Box05/RG4831AUb005f004.pdf": "11Ng2RGywGvJAVjnqoe4VKElvT-HxJiw-",
  "Box05/RG4831AUb005f003.pdf": "12XgohYvuvqtVRUUs-IAa6D9hysL4NoI2",
  "Box05/RG4831AUb005f0029.pdf": "1JiAMutAVVH6T_Ay6yDFFWmEZjVDGtufl",
  "Box05/RG4831AUb005f0028.pdf": "12ap4cRNgnjlJxKXpdf4IOPoa9NPJ_vmf",
  "Box05/RG4831AUb005f0027.pdf": "1xUE2lKBGJLbg1tP0_3OiBHmzeCdCvduk",
  "Box05/RG4831AUb005f0024.pdf": "1hu3kjCpuRHUm9vREY4JT5IenoAqY_vs7",
  "Box05/RG4831AUb005f002.pdf": "1GPfb98aknp3s33lTBXv9PGkBzWVhQQIH",
  "Box05/RG4831AUb005f001.pdf": "1xcX8Wu0d_x8O8OeNWqT9kcO1dSAxXbj_",
  "Box01/RG4831AUb001f010.pdf": "1W2nEuGvz6Y-yJG2PorJ5MYvuRMV8u2hm",
  "Box01/RG4831AUb001f009.pdf": "1u2ITOxn7dj01653-f7PyJeGRc9rHbga_",
  "Box01/RG4831AUb001f008.pdf": "10vNRgGNPNzF0Yrk5WbvCVEY21OnEsVQw",
  "Box01/RG4831AUb001f007.pdf": "1vBR0-wECDIFy-vtkAT1BCUG6wYgPzdkH",
  "Box01/RG4831AUb001f006.pdf": "1VCKPvUcgJNT5tyVDO2Z9YIGavVsOTcoA",
  "Box01/RG4831AUb001f005.pdf": "1LzvdNaFWsBacm12DChyrpx3ZJ8RPAWOC",
  "Box01/RG4831AUb001f004.pdf": "1gBmPpV10BNoOZ8Fpt7qwILfvFj66CsOD",
  "Box01/RG4831AUb001f003.pdf": "1bwzsvpQ2lKFebJmLZ-VltmuGi3Y4YD_K",
  "Box01/RG4831AUb001f002.pdf": "1JnPVDlMFXXni1FymUAwUzr2mfsx8iLmn",
  "Box01/RG4831AUb001f001.pdf": "1XpLlSfIG6J5YUS9efnlYjmL1D8XMVO8F",
  "Box01/RG4831AUb001f011.pdf": "1n1s4Yiid0eg7gEYQC6yEhb0n2BEfi5cx",
  "Box02/RG4831AUb002f029.pdf": "15LbDdlJKS4rQcgLur2tcbpWbkL-UKEaG",
  "Box02/RG4831AUb002f028.pdf": "1KpX3-pZO7EKEhv0gf-UdUhxEy9mGherd",
  "Box02/RG4831AUb002f027.pdf": "1S_MT4fNyBktBJv4YrHfzb6pNkpolb6eD",
  "Box02/RG4831AUb002f026.pdf": "1iyBMcvLaphbB35CVggBEN9vrybiKFpkm",
  "Box02/RG4831AUb002f025.pdf": "1PfZO06UvmC1O7mad6uds0WQAnad2ucJC",
  "Box02/RG4831AUb002f024.pdf": "1Y9ilEAVXkkHY3302xHcqItG-SSri3HaN",
  "Box02/RG4831AUb002f023.pdf": "17uXOyylef-oA3QXXAaF43ZrCD16CdSPd",
  "Box02/RG4831AUb002f022.pdf": "1z1Q5IaidzyFJkj4S1j9Ixwl0DreihoBK",
  "Box02/RG4831AUb002f021.pdf": "1yfFsp39kcIJ_WEhW6Zl8hjutV6cz4ABu",
  "Box02/RG4831AUb002f020.pdf": "1udNLwaCBeYpG0rfIKXGTKrn4FxMgV64I",
  "Box02/RG4831AUb002f019.pdf": "16Z4J2I8HlCC6CyqgmSG001hY6sEv7nhX",
  "Box02/RG4831AUb002f018.pdf": "1rwNgoWEvTnB3ja-qZEnOmGH0WVtZcQ4N",
  "Box02/RG4831AUb002f017.pdf": "1szCuEkFCEXhJCdGtL4fdl4v3H0FMGWd8",
  "Box02/RG4831AUb002f016.pdf": "1kqTLnnAv3ctJ8YPFBmbEFwCzWTAJqSjU",
  "Box02/RG4831AUb002f015.pdf": "1VtOwv429vwFWBUVX1xanFh4GanWKhyhX",
  "Box02/RG4831AUb002f014.pdf": "1DqNQpZxlya52suHvsfjCl2MJvt4twVHS",
  "Box02/RG4831AUb002f013.pdf": "16Ev4Q8zTKheFjmyQm7fMFisiwiGo60ll",
  "Box02/RG4831AUb002f012.pdf": "1ofGWhzpVEDiIsmhFCFLznR4b4VVg6Dw2",
  "Box02/RG4831AUb002f011.pdf": "1lNALoJTIks96GHQrg-Q_dCvHALFDMTox",
  "Box02/RG4831AUb002f010.pdf": "1yfRlO-zy--8_kI4WpgKg7OrKqbzaDsI3",
  "Box02/RG4831AUb002f009.pdf": "1jClbyGaw1iOFFggkXvdV0nTTv3HW9DZy",
  "Box02/RG4831AUb002f008.pdf": "18i8b0War7ywD4tb60fI3HYm65H_0ODUo",
  "Box02/RG4831AUb002f007.pdf": "1Ltt64vNpbZIs5ElOQriExj2hymUXBKwD",
  "Box02/RG4831AUb002f006.pdf": "13zNayWhypLitRNw-iIjJHLk4VS_G2Bc5",
  "Box02/RG4831AUb002f005.pdf": "1ZxAvdBNkyHLHB6Rt8WAUPOjWG3BVJMQG",
  "Box02/RG4831AUb002f004.pdf": "1BvDSn2Wdz9dicZWxZoxvDy8PnHuQvj-A",
  "Box02/RG4831AUb002f003.pdf": "12-pPIT4RMq0ZQO02w9KynCph6Brsjwh9",
  "Box02/RG4831AUb002f002.pdf": "16justZUMC5i1e0rTzXEr-jyzPrqQuRgj",
  "Box02/RG4831AUb002f001.pdf": "1V4Sy88gi0bMIltbVlhq__9dSWeI_3zeI"
};

function looksLikeDriveId(str) {
  return /^[A-Za-z0-9_-]{20,}$/.test(str);
}
function normalizeLegacyPath(path) {
  if (!path) return null;
  return path
    .replace(/^work\/pdf_ocr\//, "")
    .replace(/^pdf_ocr\//, "")
    .replace(/^ocr\//, "");
}
function getPdfBase64(pathOrId) {
  let fileId = null;
  Logger.log("Combined endpoint ACTIVE");
  Logger.log("=== Combined endpoint ACTIVE v26 ===");
  Logger.log("Received pdfPath:", pathOrId);
  if (looksLikeDriveId(pathOrId)) {
    fileId = pathOrId;
  }

  if (!fileId && PDF_MAP[pathOrId]) {
    fileId = PDF_MAP[pathOrId];
  }

  if (!fileId) {
    const normalized = normalizeLegacyPath(pathOrId);
    if (normalized && PDF_MAP[normalized]) {
      fileId = PDF_MAP[normalized];
    }
  }

  if (!fileId) {
    return ContentService
      .createTextOutput(JSON.stringify({ error: "Unknown pdfPath: " + pathOrId }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  try {
    const file = DriveApp.getFileById(fileId);
    const blob = file.getBlob();
    const base64 = Utilities.base64Encode(blob.getBytes());

    return ContentService
      .createTextOutput(JSON.stringify({ data: base64 }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({
        error: "Failed to load PDF for: " + pathOrId,
        details: err.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/************************************************************
 *  MAIN ROUTER (doGet)
 ************************************************************/

function doGet(e) {
Logger.log("=== doGet HIT ===");
Logger.log(JSON.stringify(e.parameter, null, 2));
  // Serve index.json
  if (e && e.parameter && e.parameter.data === "index") {
    const json = getIndexJson();
    return ContentService
      .createTextOutput(json)
      .setMimeType(ContentService.MimeType.JSON);
  }

  // Serve PDFs as Base64 JSON
  if (e && e.parameter && e.parameter.pdfPath) {
    return getPdfBase64(e.parameter.pdfPath);
  }

  // Serve the UI (Index.html)
  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle('LLCGS Search')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}


/************************************************************
 *  INDEX.JSON LOADER
 ************************************************************/

function getIndexJson() {
  const file = DriveApp.getFileById(INDEX_JSON_FILE_ID);
  return file.getBlob().getDataAsString();
}


/************************************************************
 *  PDF BASE64 ENDPOINT
 ************************************************************/

function getPdfBase64(pdfPath) {
  const PDF_MAP = getPdfMap();
  const fileId = PDF_MAP[pdfPath];

  if (!fileId) {
    return ContentService
      .createTextOutput(JSON.stringify({ error: "Unknown pdfPath: " + pdfPath }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  const file = DriveApp.getFileById(fileId);
  const blob = file.getBlob();
  const base64 = Utilities.base64Encode(blob.getBytes());

  return ContentService
    .createTextOutput(JSON.stringify({ data: base64 }))
    .setMimeType(ContentService.MimeType.JSON);
}


/************************************************************
 *  DYNAMIC PDF MAP (auto-scan Drive folder)
 ************************************************************/

function getPdfMap() {
  const cache = CacheService.getScriptCache();
  const cached = cache.get(PDF_MAP_CACHE_KEY);

  if (cached) {
    return JSON.parse(cached);
  }

  const root = DriveApp.getFolderById(PDF_ROOT_FOLDER_ID);
  const map = {};

  buildPdfMapRecursive(root, "", map);

  // Cache for 6 hours
  cache.put(PDF_MAP_CACHE_KEY, JSON.stringify(map), PDF_MAP_CACHE_HOURS * 3600);

  return map;
}

function buildPdfMapRecursive(folder, prefix, map) {
  // Add PDFs in this folder
  const files = folder.getFiles();
  while (files.hasNext()) {
    const file = files.next();
    if (file.getMimeType() === MimeType.PDF) {
      const name = file.getName();
      const logicalPath = prefix ? `${prefix}/${name}` : name;
      map[logicalPath] = file.getId();
    }
  }

  // Recurse into subfolders
  const subfolders = folder.getFolders();
  while (subfolders.hasNext()) {
    const sub = subfolders.next();
    const subPrefix = prefix ? `${prefix}/${sub.getName()}` : sub.getName();
    buildPdfMapRecursive(sub, subPrefix, map);
  }
}


/************************************************************
 *  HTML INCLUDE HELPER
 ************************************************************/

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/************************************************************
 *  BUILD PDF_MAP BY SCANNING DRIVE
 *  Scans a root folder and all subfolders.
 *  Produces:  { "Box01/Filename.pdf": "DriveFileID", ... }
 ************************************************************/

// Set this to the folder that contains all your Box folders


function buildPdfMap() {
  const root = DriveApp.getFolderById(PDF_ROOT_FOLDER_ID);
  const map = {};

  walkFolder(root, "", map);

  Logger.log("PDF_MAP:\n" + JSON.stringify(map, null, 2));
  return map;
}

/************************************************************
 *  Recursive folder walker
 ************************************************************/
function walkFolder(folder, prefix, map) {
  // Process PDFs in this folder
  const files = folder.getFiles();
  while (files.hasNext()) {
    const file = files.next();
    if (file.getMimeType() === MimeType.PDF) {
      const name = file.getName();
      const logicalPath = prefix ? `${prefix}/${name}` : name;
      map[logicalPath] = file.getId();
    }
  }

  // Recurse into subfolders
  const subfolders = folder.getFolders();
  while (subfolders.hasNext()) {
    const sub = subfolders.next();
    const subPrefix = prefix ? `${prefix}/${sub.getName()}` : sub.getName();
    walkFolder(sub, subPrefix, map);
  }
}

/************************************************************
 *  VALIDATE INDEX.JSON AGAINST PDF_MAP
 ************************************************************/
function validateIndexAgainstPdfMap() {
  const map = buildPdfMap(); // or load your cached map
  const index = JSON.parse(getIndexJson()); // your existing function

  const missing = [];

  for (let docId in index.documents) {
    const path = index.documents[docId].pdf_path;

    // Normalize legacy paths
    const normalized = normalizeLegacyPath(path);

    if (!map[path] && !map[normalized]) {
      missing.push({ docId, path, normalized });
    }
  }

  if (missing.length === 0) {
    Logger.log("All PDFs accounted for.");
  } else {
    Logger.log("Missing PDFs:\n" + JSON.stringify(missing, null, 2));
  }
}

function normalizeLegacyPath(path) {
  if (!path) return null;

  return path
    .replace(/^work\/pdf_ocr\//, "")
    .replace(/^pdf_ocr\//, "")
    .replace(/^ocr\//, "");
}

function savePdfMapToDrive() {
  const map = buildPdfMap();
  const json = JSON.stringify(map, null, 2);

  const folder = DriveApp.getFolderById(PDF_ROOT_FOLDER_ID);
  const file = folder.createFile("PDF_MAP.json", json, MimeType.PLAIN_TEXT);

  Logger.log("PDF_MAP written to: " + file.getUrl());
}
