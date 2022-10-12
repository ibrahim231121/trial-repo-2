import { responsiveFontSizes } from '@material-ui/core';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import Cookies from 'universal-cookie';
import { UsersAndIdentitiesServiceAgent } from '../utils/Api/ApiAgent';
import { UsersInfo } from '../utils/Api/models/UsersAndIdentitiesModel';
import { GROUP_GET_BY_ID_URL, USER } from '../utils/Api/url'

const cookies = new Cookies();
const Users = [
    {
        "recId": "45",
        "userName": "raza45",
        "fName": "Wasim1",
        "lName": "Yameen1",
        "lastLogin": null,
        "userGroups": "Aaa, Aab, AyeshaGRoup89, Group300, Group305",
        "email": "faisal@hyperdata.com",
        "status": "Deactivated"
    },
    {
        "recId": "637679158369934982",
        "userName": "testuser1f",
        "fName": "test",
        "lName": "user",
        "lastLogin": null,
        "userGroups": "Mohsin Group 1, Mohsin Group 2, Mohsin , jbnmb, Mohsin Group 33, Mohsin 3, lkjlkj, qwerty, qwerty1, qwerty124, qwerty125, qwerty126, Group127, Group128, Group140, Group150, Group155, Group156, Group161, Group 170, Group175, Group176, Group 200, Group201, Group 202, Group210, Group260, Group300, Group305",
        "email": "test@gmail.com",
        "status": "Active"
    },
    {
        "recId": "637692926208494875",
        "userName": "Jaffy",
        "fName": "jaffar",
        "lName": "dart",
        "lastLogin": null,
        "userGroups": "Aaa",
        "email": "jaffarrazadar@gmail.com",
        "status": "Deactivated"
    },
    {
        "recId": "637692928386297818",
        "userName": "jaffar",
        "fName": "Spp",
        "lName": "Jr7",
        "lastLogin": null,
        "userGroups": "AyeGroup123, AyGroup, Group1, Group5, Group150, Group180, Group300",
        "email": "ayesha.farooq@hyperdatacomputing.com",
        "status": "Deactivated"
    },
    {
        "recId": "637692930151764487",
        "userName": "SQA73",
        "fName": "Spp",
        "lName": "Jr7",
        "lastLogin": null,
        "userGroups": "Group2, AyGroup, AyeGroup123, Mohsin 3, Group176, Group300",
        "email": "SQA73@gmail.com",
        "status": "Active"
    },
    {
        "recId": "637692936257690564",
        "userName": "SQA74",
        "fName": "Spp",
        "lName": "Jr7",
        "lastLogin": null,
        "userGroups": "Group3, testofficer",
        "email": "afarooq@irsavideo.com",
        "status": "Active"
    },
    {
        "recId": "637692941122410699",
        "userName": "SQA75",
        "fName": "Spp",
        "lName": "Jr7",
        "lastLogin": null,
        "userGroups": "Group4, testofficer",
        "email": "SQA75@gmail.com",
        "status": "AccountLocked"
    },
    {
        "recId": "637692955863544199",
        "userName": "SQA76",
        "fName": "Spp",
        "lName": "Jr7",
        "lastLogin": null,
        "userGroups": "Group5, testofficer",
        "email": "ayeshafarooq@gmail.com",
        "status": "Active"
    },
    {
        "recId": "637693027404619498",
        "userName": "SQA77",
        "fName": "Spp",
        "lName": "Jr7",
        "lastLogin": null,
        "userGroups": "AyeshaGroup, testofficer",
        "email": "SQA77@gmail.com",
        "status": "NewlyCreated"
    },
    {
        "recId": "637693031940469368",
        "userName": "SQA78",
        "fName": "Spp",
        "lName": "Jr7",
        "lastLogin": null,
        "userGroups": "AyGroup, AyeGroup123, testofficer",
        "email": "SQA78@gmail.com",
        "status": "Deactivated"
    },
    {
        "recId": "637693036353675688",
        "userName": "SQA79",
        "fName": "Spp",
        "lName": "Jr7",
        "lastLogin": null,
        "userGroups": "AyGroup, testofficer",
        "email": "SQA79@gmail.com",
        "status": "Active"
    },
    {
        "recId": "637693037639867433",
        "userName": "SQA80",
        "fName": "Spp",
        "lName": "Jr7",
        "lastLogin": null,
        "userGroups": "AyeGroup123, testofficer",
        "email": "SQA80@gmail.com",
        "status": "Active"
    },
    {
        "recId": "637694598533673496",
        "userName": "Ayesha",
        "fName": "Spp",
        "lName": "Jr7",
        "lastLogin": null,
        "userGroups": null,
        "email": "SQA81@gmail.com",
        "status": "Active"
    },
    {
        "recId": "637694598888691766",
        "userName": "SQA82",
        "fName": "aisha",
        "lName": "farooq",
        "lastLogin": null,
        "userGroups": null,
        "email": "SQA82@gmail.com",
        "status": "NewlyCreated"
    },
    {
        "recId": "637694598942591667",
        "userName": "SQA83",
        "fName": "aisha",
        "lName": "farooq",
        "lastLogin": null,
        "userGroups": "FGroup",
        "email": "SQA83@gmail.com",
        "status": "Active"
    },
    {
        "recId": "637694614618654485",
        "userName": "yuo",
        "fName": "aisha",
        "lName": "farooq",
        "lastLogin": null,
        "userGroups": null,
        "email": "SQA84@gmail.com",
        "status": "Active"
    },
    {
        "recId": "637705207433745564",
        "userName": "SQA100",
        "fName": "aisha",
        "lName": "farooq",
        "lastLogin": null,
        "userGroups": "AyeshaGroup1, AyeshaGRoup89",
        "email": "SQA100@gmail.com",
        "status": "Active"
    },
    {
        "recId": "637705207701258998",
        "userName": "SQA101",
        "fName": "aisha",
        "lName": "farooq",
        "lastLogin": null,
        "userGroups": "AyeshaGroup1, AyeshaGRoup89",
        "email": "SQA101@gmail.com",
        "status": "NewlyCreated"
    },
    {
        "recId": "637713641075445413",
        "userName": "SQA102",
        "fName": "aisha",
        "lName": "farooq",
        "lastLogin": null,
        "userGroups": "AyeshaGroup1, AyeshaGRoup89",
        "email": "SQA102@gmail.com",
        "status": "Active"
    },
    {
        "recId": "637713641457686157",
        "userName": "SQA103",
        "fName": "aisha",
        "lName": "farooq",
        "lastLogin": null,
        "userGroups": "AyeshaGroup1, AyeshaGRoup89",
        "email": "SQA103@gmail.com",
        "status": "NewlyCreated"
    },
    {
        "recId": "637713641613293423",
        "userName": "SQA104",
        "fName": "aisha",
        "lName": "farooq",
        "lastLogin": null,
        "userGroups": null,
        "email": "SQA104@gmail.com",
        "status": "Active"
    },
    {
        "recId": "637713641762605276",
        "userName": "SQA105",
        "fName": "aisha",
        "lName": "farooq",
        "lastLogin": null,
        "userGroups": null,
        "email": "SQA105@gmail.com",
        "status": "Active"
    },
    {
        "recId": "637713641833755930",
        "userName": "SQA106",
        "fName": "aisha",
        "lName": "farooq",
        "lastLogin": null,
        "userGroups": null,
        "email": "SQA106@gmail.com",
        "status": "Active"
    },
    {
        "recId": "637713646877646011",
        "userName": "MohsinMemon",
        "fName": "Spp",
        "lName": "Jr7",
        "lastLogin": null,
        "userGroups": "Mohsin Group 1, Mohsin Group 2, Mohsin Group 33",
        "email": "mohsin@gmail.com",
        "status": "NewlyCreated"
    },
    {
        "recId": "637713650377721336",
        "userName": "SQA1091",
        "fName": "aisha1",
        "lName": "farooq1",
        "lastLogin": null,
        "userGroups": "Officer group",
        "email": "SQA1091@gmail.com",
        "status": "Active"
    },
    {
        "recId": "637713654636629950",
        "userName": "SQA113",
        "fName": "aisha",
        "lName": "farooq",
        "lastLogin": null,
        "userGroups": "FGroup7, Mohsin Group 1, Mohsin Group 33, Officer group",
        "email": "SQA113@gmail.com",
        "status": "Active"
    },
    {
        "recId": "637713655707438244",
        "userName": "SQA114",
        "fName": "aisha",
        "lName": "farooq",
        "lastLogin": null,
        "userGroups": "Officer group",
        "email": "SQA114@gmail.com",
        "status": "Active"
    },
    {
        "recId": "637713710585231747",
        "userName": "SQA115",
        "fName": "aisha",
        "lName": "farooq",
        "lastLogin": null,
        "userGroups": "Officer group",
        "email": "SQA115@gmail.com",
        "status": "Active"
    },
    {
        "recId": "637713710617318931",
        "userName": "SQA116",
        "fName": "aisha",
        "lName": "farooq",
        "lastLogin": null,
        "userGroups": "Officer group",
        "email": "SQA116@gmail.com",
        "status": "Active"
    },
    {
        "recId": "637713710636208714",
        "userName": "SQA117",
        "fName": "aisha",
        "lName": "farooq",
        "lastLogin": null,
        "userGroups": null,
        "email": "SQA117@gmail.com",
        "status": "Active"
    },
    {
        "recId": "637715443741871754",
        "userName": "SQA119",
        "fName": "aisha",
        "lName": "farooq",
        "lastLogin": null,
        "userGroups": "Officer group",
        "email": "SQA119@gmail.com",
        "status": "Active"
    },
    {
        "recId": "637717050173788970",
        "userName": "SQA120",
        "fName": "aisha",
        "lName": "farooq",
        "lastLogin": null,
        "userGroups": "Officer group",
        "email": "SQA120@gmail.com",
        "status": "Active"
    },
    {
        "recId": "637717050284824128",
        "userName": "SQA121",
        "fName": "aisha",
        "lName": "farooq",
        "lastLogin": null,
        "userGroups": null,
        "email": "SQA121@gmail.com",
        "status": "Active"
    },
    {
        "recId": "637717052044200748",
        "userName": "SQA122",
        "fName": "aisha",
        "lName": "farooq",
        "lastLogin": null,
        "userGroups": null,
        "email": "SQA122@gmail.com",
        "status": "Active"
    },
    {
        "recId": "637717053778465977",
        "userName": "SQA123",
        "fName": "aisha",
        "lName": "farooq",
        "lastLogin": null,
        "userGroups": null,
        "email": "SQA123@gmail.com",
        "status": "Active"
    },
    {
        "recId": "637717055906902726",
        "userName": "SQA124",
        "fName": "aisha",
        "lName": "farooq",
        "lastLogin": null,
        "userGroups": null,
        "email": "SQA124@gmail.com",
        "status": "Active"
    },
    {
        "recId": "637717062713246609",
        "userName": "SQA125",
        "fName": "aisha",
        "lName": "farooq",
        "lastLogin": null,
        "userGroups": null,
        "email": "SQA125@gmail.com",
        "status": "NewlyCreated"
    },
    {
        "recId": "637717063423167143",
        "userName": "SQA1266",
        "fName": "aisha6",
        "lName": "farooq6",
        "lastLogin": null,
        "userGroups": null,
        "email": "SQA126@gmail.com",
        "status": "Pending"
    },
    {
        "recId": "637717074754811324",
        "userName": "SQA127",
        "fName": "aisha",
        "lName": "farooq",
        "lastLogin": null,
        "userGroups": null,
        "email": "SQA127@gmail.com",
        "status": "Pending"
    },
    {
        "recId": "637717186972191197",
        "userName": "SQA128",
        "fName": "aisha",
        "lName": "farooq",
        "lastLogin": null,
        "userGroups": null,
        "email": "SQA128@gmail.com",
        "status": "Active"
    },
    {
        "recId": "637725618046499394",
        "userName": "SQA129",
        "fName": "aisha",
        "lName": "farooq",
        "lastLogin": null,
        "userGroups": null,
        "email": "SQA129@gmail.com",
        "status": "AccountLocked"
    },
    {
        "recId": "637725618127255043",
        "userName": "SQA130",
        "fName": "aisha",
        "lName": "farooq",
        "lastLogin": null,
        "userGroups": null,
        "email": "SQA130@gmail.com",
        "status": "AccountLocked"
    },
    {
        "recId": "637725618145863684",
        "userName": "SQA131",
        "fName": "aisha",
        "lName": "farooq",
        "lastLogin": null,
        "userGroups": null,
        "email": "SQA131@gmail.com",
        "status": "AccountLocked"
    },
    {
        "recId": "637725618166608265",
        "userName": "SQA132",
        "fName": "aisha",
        "lName": "farooq",
        "lastLogin": null,
        "userGroups": null,
        "email": "SQA132@gmail.com",
        "status": "Active"
    },
    {
        "recId": "637725618184939868",
        "userName": "SQA133",
        "fName": "aisha",
        "lName": "farooq",
        "lastLogin": null,
        "userGroups": null,
        "email": "SQA133@gmail.com",
        "status": "Active"
    },
    {
        "recId": "637727322042291732",
        "userName": "faisal",
        "fName": "Spp",
        "lName": "Jr7",
        "lastLogin": null,
        "userGroups": null,
        "email": "faisal@gmail.com",
        "status": "NewlyCreated"
    },
    {
        "recId": "637727325141252856",
        "userName": "faisal123",
        "fName": "Spp",
        "lName": "Jr7",
        "lastLogin": null,
        "userGroups": null,
        "email": "faisal123@gmail.com",
        "status": "NewlyCreated"
    },
    {
        "recId": "637727325723280323",
        "userName": "faisal789",
        "fName": "Spp",
        "lName": "Jr7",
        "lastLogin": null,
        "userGroups": null,
        "email": "faisal789@gmail.com",
        "status": "NewlyCreated"
    },
    {
        "recId": "637727441743374094",
        "userName": "faisal2",
        "fName": "Faisal2",
        "lName": "akh2",
        "lastLogin": null,
        "userGroups": null,
        "email": "fasial2@gmail.com",
        "status": "Active"
    },
    {
        "recId": "637727500476832699",
        "userName": "fai3",
        "fName": "Fai3",
        "lName": "akh5",
        "lastLogin": null,
        "userGroups": null,
        "email": "fai3@gmail.com",
        "status": "Active"
    },
    {
        "recId": "637727541105722847",
        "userName": "dsfdsf",
        "fName": "sdfcvxxf",
        "lName": "gxcgvdsfds",
        "lastLogin": null,
        "userGroups": null,
        "email": "dsfxcf@gmail.com",
        "status": "Active"
    },
    {
        "recId": "637727541609279746",
        "userName": "dsfdsfsdfds",
        "fName": "sdfcvxxf",
        "lName": "gxcgvdsfds",
        "lastLogin": null,
        "userGroups": null,
        "email": "dsfxcffdgg@gmail.com",
        "status": "Active"
    },
    {
        "recId": "637727562691845210",
        "userName": "dsfdsfsdfds45",
        "fName": "sdfcvxxf",
        "lName": "gxcgvdsfds",
        "lastLogin": null,
        "userGroups": null,
        "email": "dsfxcffdg45g@gmail.com",
        "status": "Active"
    },
    {
        "recId": "637727563277537072",
        "userName": "dsfdsfsdfgdfds45",
        "fName": "sdfcvxxf",
        "lName": "gxcgvdsfds",
        "lastLogin": null,
        "userGroups": null,
        "email": "dsfxcffddfgg45g@gmail.com",
        "status": "Active"
    },
    {
        "recId": "637727566476706007",
        "userName": "dsfdsfsdfgdfds45ghj",
        "fName": "sdfcvxxf",
        "lName": "gxcgvdsfds",
        "lastLogin": null,
        "userGroups": null,
        "email": "dsfxcffddfgrtyg45g@gmail.com",
        "status": "Active"
    },
    {
        "recId": "637727566965091261",
        "userName": "jggfgf",
        "fName": "sdfcvxxf",
        "lName": "gxcgvdsfds",
        "lastLogin": null,
        "userGroups": null,
        "email": "dfhdfgfg@gmail.com",
        "status": "Active"
    },
    {
        "recId": "637727567761264746",
        "userName": "asddsfdfg",
        "fName": "sdfcvxxf",
        "lName": "gxcgvdsfds",
        "lastLogin": null,
        "userGroups": null,
        "email": "adffsgfh@gmail.com",
        "status": "Active"
    },
    {
        "recId": "637727568492418333",
        "userName": "qwerty",
        "fName": "sdfcvxxf",
        "lName": "gxcgvdsfds",
        "lastLogin": null,
        "userGroups": null,
        "email": "qwerty@gmail.com",
        "status": "Active"
    },
    {
        "recId": "637727568787145686",
        "userName": "qwerty1",
        "fName": "sdfcvxxf",
        "lName": "gxcgvdsfds",
        "lastLogin": null,
        "userGroups": null,
        "email": "qwerty1@gmail.com",
        "status": "Active"
    },
    {
        "recId": "637728285039927265",
        "userName": "qwqwqw",
        "fName": "fgdfgdfg",
        "lName": "sddsf",
        "lastLogin": null,
        "userGroups": null,
        "email": "dasfsdf@gmail.com",
        "status": "Active"
    },
    {
        "recId": "637728287257050873",
        "userName": "qwqwqw1",
        "fName": "fgdfgdfg",
        "lName": "sddsf",
        "lastLogin": null,
        "userGroups": null,
        "email": "dasfsdf1@gmail.com",
        "status": "Active"
    },
    {
        "recId": "637728315207914448",
        "userName": "fgdg",
        "fName": "xcvxv",
        "lName": "xcbxcvcx",
        "lastLogin": null,
        "userGroups": null,
        "email": "vfhdfgdf@gmail.com",
        "status": "Active"
    },
    {
        "recId": "637728323447894263",
        "userName": "dfgdf",
        "fName": "dfgfdg",
        "lName": "dfgdfg",
        "lastLogin": null,
        "userGroups": null,
        "email": "dfgdfgdf@gmail.com",
        "status": "Active"
    },
    {
        "recId": "637728325907990476",
        "userName": "gdfg",
        "fName": "dfgsgfh",
        "lName": "dfhfsg",
        "lastLogin": null,
        "userGroups": null,
        "email": "qwaszx@gmail.com",
        "status": "Active"
    },
    {
        "recId": "637728327892913085",
        "userName": "ujghjh",
        "fName": "hjjhjhjh",
        "lName": "jhjfh",
        "lastLogin": null,
        "userGroups": null,
        "email": "jghjf@gmail.com",
        "status": "Active"
    },
    {
        "recId": "637728329245442316",
        "userName": "hgjfmhh",
        "fName": "vnghvbn",
        "lName": "vbdgbcn",
        "lastLogin": null,
        "userGroups": null,
        "email": "hfgbcbngc@gmail.com",
        "status": "Active"
    },
    {
        "recId": "637728331691596376",
        "userName": "dghdf",
        "fName": "dffjdbg",
        "lName": "ncvgxn",
        "lastLogin": null,
        "userGroups": null,
        "email": "cvxfc@gmail.com",
        "status": "Active"
    },
    {
        "recId": "637728343709602572",
        "userName": "ghgh",
        "fName": "fdghh",
        "lName": "dfggh",
        "lastLogin": null,
        "userGroups": null,
        "email": "fgfsgfs@gmail.com",
        "status": "Active"
    },
    {
        "recId": "637728344165518506",
        "userName": "poiuyt",
        "fName": "poiuyt",
        "lName": "poiuyt",
        "lastLogin": null,
        "userGroups": null,
        "email": "poiuyt@gmail.com",
        "status": "Active"
    },
    {
        "recId": "637728345384057936",
        "userName": "plm",
        "fName": "plm",
        "lName": "plm",
        "lastLogin": null,
        "userGroups": null,
        "email": "plm@gmail.com",
        "status": "Active"
    },
    {
        "recId": "637728349781343181",
        "userName": "Faisal123789",
        "fName": "dlkfjsfksfjd",
        "lName": "sldkfjsflksj",
        "lastLogin": null,
        "userGroups": null,
        "email": "faisal123789@gmail.com",
        "status": "Active"
    },
    {
        "recId": "637728395758826932",
        "userName": "fdgdf",
        "fName": "dfhdfh",
        "lName": "dfhdfh",
        "lastLogin": null,
        "userGroups": null,
        "email": "dfhhd@gmail.com",
        "status": "Active"
    },
    {
        "recId": "637728416777407172",
        "userName": "raza99",
        "fName": "dfhdfhd",
        "lName": "dhdgh",
        "lastLogin": null,
        "userGroups": null,
        "email": "hdfhfhdf@gmail.com",
        "status": "Active"
    },
    {
        "recId": "637728420737406538",
        "userName": "raza23",
        "fName": "dfgdfh",
        "lName": "dfdfhf",
        "lastLogin": null,
        "userGroups": null,
        "email": "dfhrgdfgd@gmail.com",
        "status": "Active"
    },
    {
        "recId": "637728426009325737",
        "userName": "raza13",
        "fName": "adfdf",
        "lName": "sdfdsf",
        "lastLogin": null,
        "userGroups": null,
        "email": "sdfdsf@gmail.com",
        "status": "Active"
    },
    {
        "recId": "637728438572357888",
        "userName": "dfgdfg",
        "fName": "dfgdfg",
        "lName": "fsgfg",
        "lastLogin": null,
        "userGroups": null,
        "email": "sfgsg@gmail.com",
        "status": "Active"
    },
    {
        "recId": "637728455890458057",
        "userName": "fhjfdg",
        "fName": "sfgsg",
        "lName": "gdfgdfg",
        "lastLogin": null,
        "userGroups": null,
        "email": "dfgfg@gmail.com",
        "status": "Active"
    },
    {
        "recId": "637728457790227561",
        "userName": "lklklkl",
        "fName": "sdbdfsdbsgfg",
        "lName": "ddanbdsfbds",
        "lastLogin": null,
        "userGroups": null,
        "email": "bsdbdsbds@gmail.com",
        "status": "Active"
    },
    {
        "recId": "637729043824033635",
        "userName": "trtfdfhf",
        "fName": "ysetgsgah",
        "lName": "fsdfgsfgf",
        "lastLogin": null,
        "userGroups": null,
        "email": "fgsdffgf@gmail.com",
        "status": "Active"
    },
    {
        "recId": "637729060401391733",
        "userName": "fgdfgf",
        "fName": "vcbdfgxc",
        "lName": "xccxv",
        "lastLogin": null,
        "userGroups": null,
        "email": "xcvxcvx@gmail.com",
        "status": "Active"
    },
    {
        "recId": "637729275718190941",
        "userName": "SQA138",
        "fName": "aisha",
        "lName": "farooq",
        "lastLogin": null,
        "userGroups": "PGroup7, IGroup7, KGroup7",
        "email": "SQA138@gmail.com",
        "status": "Active"
    },
    {
        "recId": "637729275868149645",
        "userName": "SQA139",
        "fName": "aisha",
        "lName": "farooq",
        "lastLogin": null,
        "userGroups": "PGroup7, IGroup7, KGroup7",
        "email": "SQA139@gmail.com",
        "status": "Active"
    },
    {
        "recId": "637729362679867284",
        "userName": "fgdfg",
        "fName": "dfg",
        "lName": "dfgdfg",
        "lastLogin": null,
        "userGroups": null,
        "email": "dfgdfgd@gmail.com",
        "status": "Active"
    },
    {
        "recId": "637729363639289483",
        "userName": "asdfghj",
        "fName": "fgxgdfgd",
        "lName": "dfgdfgdf",
        "lastLogin": null,
        "userGroups": null,
        "email": "fdgdfg@gdhdg.com",
        "status": "Active"
    },
    {
        "recId": "637729364228184714",
        "userName": "cvhbc",
        "fName": "chcgh",
        "lName": "chcvhb",
        "lastLogin": null,
        "userGroups": null,
        "email": "vch@fssd.com",
        "status": "Active"
    },
    {
        "recId": "637729386632282916",
        "userName": "dfsf",
        "fName": "dsfsdfs",
        "lName": "sdfsdf",
        "lastLogin": null,
        "userGroups": "Aaa, Aab, Aac",
        "email": "dsfs@dsfsd.com",
        "status": "Active"
    },
    {
        "recId": "637729388265581321",
        "userName": "FaisalBhai",
        "fName": "Faisal",
        "lName": "Bhai",
        "lastLogin": null,
        "userGroups": "Aaa, Aab, Aac",
        "email": "faisalbhai@gmail.com",
        "status": "Active"
    },
    {
        "recId": "637731658944993934",
        "userName": "fdhg",
        "fName": "dfgfdh",
        "lName": "fggfgfshdfg",
        "lastLogin": null,
        "userGroups": "Aaa, Aab, Aac",
        "email": "gdgdfg@gmail.com",
        "status": "Active"
    },
    {
        "recId": "637731693244676782",
        "userName": "hassan21",
        "fName": "fgsdgsgfdg",
        "lName": "xgxfsgzfsdg",
        "lastLogin": null,
        "userGroups": "Aaa, Aab, Aac",
        "email": "sdgsdxf@gmail.com",
        "status": "Active"
    },
    {
        "recId": "637731821097935840",
        "userName": "missam21",
        "fName": "dfhgh",
        "lName": "gsfgdfxg",
        "lastLogin": null,
        "userGroups": "Aaa, Aab, Aac",
        "email": "fgxdfg@gmail.com",
        "status": "Active"
    },
    {
        "recId": "637731840583081697",
        "userName": "SQA158158",
        "fName": "aisha",
        "lName": "farooq",
        "lastLogin": null,
        "userGroups": null,
        "email": "SQA158158@gmail.com",
        "status": "Active"
    },
    {
        "recId": "637732649850380302",
        "userName": "dgdfg",
        "fName": "sdfsg",
        "lName": "dgsdg",
        "lastLogin": null,
        "userGroups": "Aab",
        "email": "sdgsgds@gmail.com",
        "status": "Active"
    },
    {
        "recId": "637732652702057673",
        "userName": "dsfgdsgfg",
        "fName": "gsdgsd",
        "lName": "gsgs",
        "lastLogin": null,
        "userGroups": "Aab",
        "email": "gsfgdsg@gmail.com",
        "status": "Active"
    },
    {
        "recId": "637732655852330307",
        "userName": "dsfgdsgf",
        "fName": "gsdgsd",
        "lName": "gsgs",
        "lastLogin": null,
        "userGroups": "Aab",
        "email": "gsfgdsf@gmail.com",
        "status": "Active"
    },
    {
        "recId": "637732656336071105",
        "userName": "dsfgdsgh",
        "fName": "gsdgsd",
        "lName": "gsgs",
        "lastLogin": null,
        "userGroups": "Aab",
        "email": "gsfgds@gmail.com",
        "status": "Active"
    },
    {
        "recId": "637732657158802523",
        "userName": "hjkjfdghgfgfsf",
        "fName": "sdfgdfadfds",
        "lName": "dsdsdfsad",
        "lastLogin": null,
        "userGroups": "Aac",
        "email": "adaas@gmail.com",
        "status": "Active"
    },
    {
        "recId": "637732676686972958",
        "userName": "dfgdf456",
        "fName": "dgsdfsfg",
        "lName": "dxvdvd",
        "lastLogin": null,
        "userGroups": "Aab, AyeshaGRoup89",
        "email": "vxxdvx@gmail.com",
        "status": "Active"
    },
    {
        "recId": "637732681575685343",
        "userName": "demp",
        "fName": "adil",
        "lName": "demo",
        "lastLogin": null,
        "userGroups": "Aab, AyeshaGRoup89, Group175",
        "email": "deko@gmail.com",
        "status": "Active"
    },
    {
        "recId": "637732711859173675",
        "userName": "dfgdfgjfgh",
        "fName": "dfgfsg",
        "lName": "fsgdfg",
        "lastLogin": null,
        "userGroups": "Aac",
        "email": "dfgdfg@gmail.com",
        "status": "Active"
    },
    {
        "recId": "637732712408281788",
        "userName": "faisal9876",
        "fName": "faisal",
        "lName": "akh",
        "lastLogin": null,
        "userGroups": "AyeshaGRoup89",
        "email": "faisalakh@gmail.com",
        "status": "Active"
    },
    {
        "recId": "637732714945000143",
        "userName": "faisal765",
        "fName": "cxvxcv",
        "lName": "xcv",
        "lastLogin": null,
        "userGroups": "AyeshaGRoup89",
        "email": "xcv@gmail.com",
        "status": "Active"
    },
    {
        "recId": "637732716880289964",
        "userName": "faisal345",
        "fName": "dsfds",
        "lName": "sdfdsf",
        "lastLogin": null,
        "userGroups": "Aac",
        "email": "sdfsdf@gmail.com",
        "status": "Active"
    },
    {
        "recId": "637732736269351042",
        "userName": "adil.raza2",
        "fName": "Adil",
        "lName": "Jrrrqwrqwr",
        "lastLogin": null,
        "userGroups": "Aaa, Aab",
        "email": "adil.raza@hyperdatacomputing.com",
        "status": "Active"
    },
    {
        "recId": "637732744069948944",
        "userName": "faisal678",
        "fName": "Faisal",
        "lName": "Akhter",
        "lastLogin": null,
        "userGroups": "AyeshaGRoup89",
        "email": "faisal786@gmail.com",
        "status": "Active"
    },
    {
        "recId": "637732745464783826",
        "userName": "faisal345678",
        "fName": "asdfasds",
        "lName": "asdasd",
        "lastLogin": null,
        "userGroups": "Aab",
        "email": "asdasd@gmail.com",
        "status": "Active"
    }
];


export const getUsersInfoAsync: any = createAsyncThunk(
    'getUsersInfo',
    async (pageiFilter?: any) => {
        const url = USER + `/GetAllUsersInfo?Page=${pageiFilter.page+1}&Size=${pageiFilter.size}`
             return await UsersAndIdentitiesServiceAgent
             .getUsersInfo(url, pageiFilter.gridFilter)
             .then((response) => {
                return response
            })

});

export const getUsersIdsAsync: any = createAsyncThunk(
    'getUsersIds',
    async () => {
        const url = USER + `/GetAllUsersInfo?Page=1&Size=1000`
        const pageiFilter = {
            gridFilter: {
              logic: "and",
              filters: []
            },
            page: 1,
            size: 1000
          }
             return await UsersAndIdentitiesServiceAgent
             .getUsersInfo(url, pageiFilter)
             .then((response) => {
                return response
            })

});


export const getUserStatusKeyValuesAsync: any = createAsyncThunk(
    'getUserStatusKeyValues',
    async () => {
        const url = USER + `/GetUserStatusKeyValues`

            return await UsersAndIdentitiesServiceAgent
            .getUserStatusKeyValues(url)
            .then((response) => {           
                return response
        })

});

export const getAllUserGroupKeyValuesAsync: any = createAsyncThunk(
    'getAllUserGroupKeyValues',
    async () => {
        const url = GROUP_GET_BY_ID_URL + `/GetAllUserGroupKeyValues`

            return await UsersAndIdentitiesServiceAgent
            .getAllUserGroupKeyValues(url)
            .then((response) => {
                return response
        })

});

// export const getUsersInfoAsync: any = createAsyncThunk(
//     'getUsersInfo',
//     async () => {
//             return Users;
//     }
// );
export const updateUsersInfoAsync: any = createAsyncThunk(
    'updateUsersInfo',
    async (args: any) => {
        var body = [
            {
                "op": "replace",
                "path": args.columnToUpdate,
                "value": args.valueToUpdate
            }
        ]
        // const requestOptions = {
        //     method: 'PATCH',
        //     headers: {
        //         'Content-Type': 'application/json', 'TenantId': '1', 'Authorization': `Bearer ${cookies.get('access_token')}`
        //     },
        //     body: JSON.stringify(body)
        // };
        const url = '/Users?userId='+ args.userId;

        // const resp = await fetch(USER_INFO_UPDATE_URL + `?userId=` + args.userId, requestOptions);
         await UsersAndIdentitiesServiceAgent.updateUserInfoURL(url, JSON.stringify(body)).then(()=> {
            args.dispatchNewCommand(true);
        }).catch((e: any) =>{
            args.dispatchNewCommand(false);
        })

        // if (resp.ok) {
        //     args.dispatchNewCommand(true);
        // }
        // else {
        //     args.dispatchNewCommand(false);
        // }
    }
);

export const userSlice = createSlice({
    name: 'user',
    initialState: { usersInfo: [], userIds: [], userStatus: [], userGroups: [] },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getUsersInfoAsync.fulfilled, (state: any, { payload }) => {
            state.usersInfo = payload;
        })
        .addCase(getUsersIdsAsync.fulfilled, (state: any, { payload }) => {
            state.userIds = payload;
        })
        .addCase(getUserStatusKeyValuesAsync.fulfilled, (state: any, { payload }) => {
            state.userStatus = payload;
        })
        .addCase(getAllUserGroupKeyValuesAsync.fulfilled, (state: any, { payload }) => {
            state.userGroups = payload;
        })
    }
});

export default userSlice;