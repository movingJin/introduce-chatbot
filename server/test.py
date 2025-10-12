from server.schema.profile import SearchCondition
from server.services.profile import load_profile
from server.workflows.introduce_workflow import SummaryNode

def profile_load_test():
    search_condition = SearchCondition(
        user_id= ["movingjin"],
        chain_id=["couple0"]
    )
    profiles = load_profile(search_condition=search_condition)
    print(profiles)

if __name__ == "__main__":
    result = SummaryNode().run("couple0", "이동진의 여자친구는 어떤 사람이야?")
    print(result)
    profile_load_test()